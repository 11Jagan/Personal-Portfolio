
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

  // Check if MONGODB_URI was set and clientPromise was initialized.
  // clientPromise will be null if MONGODB_URI is missing, a placeholder, or invalid.
  if (!clientPromise) {
    const errorMessage = "CRITICAL_SERVER_CONFIG_ERROR: MongoDB connection is not configured or failed to initialize.";
    const errorDetails = "The MONGODB_URI is missing, invalid, or connection could not be established. Please ensure MONGODB_URI is correctly set in your .env.local or deployment environment and the MongoDB server is accessible. The contact form cannot save messages without a valid database connection.";
    console.error(`${errorMessage} Details: ${errorDetails}`);
    return NextResponse.json(
      {
        error: 'Server Configuration Error: Database Unavailable.',
        details: 'The application is not configured to connect to the database. Please contact the administrator.',
      },
      { status: 503 } // 503 Service Unavailable
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
    // clientPromise is checked above, so if we reach here, it should be a Promise<MongoClient>
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
      status: "unread", 
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

    console.error('CRITICAL_ERROR in /api/contact POST handler (MongoDB interaction):', error.message, error.stack, { originalError: error });
    
    // Specific error checks for MongoDB connection issues
    if (error.name === 'MongoNetworkError' || 
        error.message.includes('connect ETIMEDOUT') || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect ECONNREFUSED') || 
        (error.message && error.message.toLowerCase().includes('failed to connect to server')) ||
        (error.message && error.message.toLowerCase().includes('server selection timed out')) 
       ) {
      errorMessage = 'Database Connection Error.';
      errorDetails = `Could not connect to the database server: ${error.message}. Please check your MONGODB_URI, network configuration, and ensure the MongoDB server is running and accessible.`;
      statusCode = 503; // Service Unavailable
    } else if (error.name === 'MongoServerError' || error.name === 'MongoAPIError') {
      errorMessage = 'Database Operation Failed.';
      errorDetails = `A database server error occurred: ${error.message}`;
    } else if (error.message && error.message.includes('MongoClient') && error.message.includes('connect')) {
        errorMessage = 'Database Connection Error.';
        errorDetails = `Failed to connect to MongoDB: ${error.message}. Please check your MONGODB_URI.`;
        statusCode = 503;
    } else if (error.message && error.message.includes("Authentication failed")) {
        errorMessage = 'Database Authentication Failed.';
        errorDetails = `Could not authenticate with the database: ${error.message}. Please check your MONGODB_URI credentials.`;
        statusCode = 401; // Unauthorized
    } else if (error.name === 'MongoParseError') { // This should ideally be caught by mongodb.ts, but as a fallback
        errorMessage = 'Invalid MongoDB URI Format.';
        errorDetails = `The provided MONGODB_URI is not valid: ${error.message}. Please ensure it starts with "mongodb://" or "mongodb+srv://".`;
        statusCode = 500; // Internal Server Error due to configuration
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
