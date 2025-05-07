
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

  // Check if MongoDB URI is configured
  if (!process.env.MONGODB_URI) {
    console.error("CRITICAL_MONGODB_CONFIG: MONGODB_URI environment variable is not set.");
    return NextResponse.json(
      { 
        error: 'Server configuration error.', 
        details: 'The database connection URI is missing. Please contact support.' 
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
    const client = await clientPromise;
    const db = client.db(MONGODB_DB_NAME); // Use the MONGODB_DB_NAME from lib
    const collection = db.collection("messages"); // Collection to store messages

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
    
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ETIMEDOUT')) {
      errorMessage = 'Database connection error.';
      errorDetails = 'Could not connect to the database server. Please try again later.';
      statusCode = 503; // Service Unavailable
    } else if (error.name === 'MongoServerError') {
      // Specific MongoDB server errors can be handled here if needed
      errorMessage = 'Database operation failed.';
      errorDetails = `A database server error occurred: ${error.message}`;
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
