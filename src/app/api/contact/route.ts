
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientPromise, MONGODB_DB_NAME } from '@/lib/mongodb'; // Import MongoDB client and DB name

// Schema for validating contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: NextRequest) {
  console.info("/api/contact POST: Request received at", new Date().toISOString());

  // Check if MongoDB URI is configured AND clientPromise was initialized
  if (!process.env.MONGODB_URI || !clientPromise) {
    console.error("CRITICAL_MONGODB_CONFIG: MONGODB_URI is not set or MongoDB clientPromise was not initialized. Ensure MONGODB_URI is set in your .env.local or deployment environment.");
    return NextResponse.json(
      {
        error: 'Server configuration error.',
        details: 'The database connection is not configured. Please ensure MONGODB_URI is correctly set and contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
  
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (parseError: any) {
    console.warn("/api/contact POST: Error parsing request JSON:", parseError.message);
    return NextResponse.json({ error: 'Invalid JSON in request body', details: parseError.message }, { status: 400 });
  }
  
  console.info("/api/contact POST: Request body parsed:", requestBody);
  const parsedData = contactFormSchema.safeParse(requestBody);

  if (!parsedData.success) {
    console.warn("/api/contact POST: Invalid input data from client:", parsedData.error.format());
    return NextResponse.json({ error: 'Invalid input data', details: parsedData.error.format() }, { status: 400 });
  }
  console.info("/api/contact POST: Input data validated successfully.");

  const { name, email, subject, message } = parsedData.data;

  try {
    // clientPromise is checked above, so it should be a valid Promise<MongoClient> here
    const awaitedClient = await clientPromise;
    const db = awaitedClient.db(MONGODB_DB_NAME);
    const collection = db.collection("messages");

    console.info(`/api/contact POST: Attempting to insert message into MongoDB database '${MONGODB_DB_NAME}', collection 'messages'.`);
    
    const result = await collection.insertOne({
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
      status: "unread", // Optional: to track message status
    });

    if (result.insertedId) {
      console.info("/api/contact POST: Message successfully saved to MongoDB with ID:", result.insertedId);
      return NextResponse.json(
        { 
          message: 'Message sent successfully and saved to database!', 
          data: { ...parsedData.data, id: result.insertedId } 
        }, 
        { status: 200 }
      );
    } else {
      console.error("/api/contact POST: Failed to save message to MongoDB. No insertedId returned.");
      return NextResponse.json({ error: 'Failed to save message to database.', details: 'Database operation did not confirm insertion.' }, { status: 500 });
    }

  } catch (error: any) {
    let errorMessage = 'An unexpected internal server error occurred while processing your message.';
    let errorDetails = error.message || 'No additional details provided.';
    let statusCode = 500;

    console.error('CRITICAL_ERROR in /api/contact POST handler (MongoDB):', error.message, error.stack, { originalError: error });
    
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection error.';
      errorDetails = 'Could not connect to the database server. Please check your MONGODB_URI or try again later.';
      statusCode = 503; // Service Unavailable
    } else if (error.name === 'MongoServerError') {
      errorMessage = 'Database operation failed.';
      errorDetails = `A database server error occurred: ${error.message}`;
    } else if (error.message && error.message.includes(' MongoClient ') && error.message.includes('connect')) {
        // Catching generic MongoClient connection errors that might not be MongoNetworkError
        errorMessage = 'Database connection error.';
        errorDetails = `Failed to connect to MongoDB: ${error.message}. Please check your MONGODB_URI.`;
        statusCode = 503;
    }
        
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails 
      }, 
      { status: statusCode }
    );
  }
}
