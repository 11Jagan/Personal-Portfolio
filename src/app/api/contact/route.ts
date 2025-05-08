
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientPromise, MONGODB_DB_NAME } from '@/lib/mongodb'; 

// Schema for validating contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: NextRequest) {
  const requestTimestamp = new Date().toISOString();
  console.info(`/api/contact POST: Request received at ${requestTimestamp}`);

  // Check if MONGODB_URI was set and clientPromise was initialized.
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === "YOUR_MONGODB_CONNECTION_STRING" || process.env.MONGODB_URI.trim() === "") {
    const serverErrorMessage = "CRITICAL_SERVER_CONFIG_ERROR: MongoDB connection string (MONGODB_URI) is not configured or is set to the placeholder value in .env.local. The contact form cannot save messages.";
    console.error(`/api/contact POST: ${serverErrorMessage}`);
    return NextResponse.json(
      {
        error: 'Server Configuration Error',
        details: "The database connection is not configured on the server. Please contact the site administrator.",
      },
      { status: 503 } // Service Unavailable
    );
  }
  
  // Check if clientPromise itself is null (could happen if URI was present but MongoClient failed to init)
  if (!clientPromise) {
    const dbInitErrorMessage = "CRITICAL_SERVER_ERROR: MongoDB client promise is null. This indicates a failure during MongoDB initialization, possibly due to an invalid MONGODB_URI or network issue preventing connection. The contact form cannot save messages.";
    console.error(`/api/contact POST: ${dbInitErrorMessage}`);
    return NextResponse.json(
      {
        error: 'Database Initialization Error',
        details: "The server's database service failed to initialize. Please contact the site administrator.",
      },
      { status: 503 } // Service Unavailable
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
      console.error("/api/contact POST: Failed to save message to MongoDB. No insertedId returned, but no error was thrown by insertOne.");
      return NextResponse.json({ error: 'Failed to save message', details: 'Database operation did not confirm insertion. This is an unexpected state.' }, { status: 500 });
    }

  } catch (error: any) {
    let errorMessage = 'An unexpected internal server error occurred while processing your message.';
    let errorDetails = error.message || 'No additional details provided.';
    let statusCode = 500;

    console.error('CRITICAL_ERROR in /api/contact POST handler (MongoDB interaction):', error.message, error.stack, { originalError: error });
    
    if (error.name === 'MongoNetworkError' || 
        error.message?.includes('connect ETIMEDOUT') || 
        error.message?.includes('ECONNREFUSED') ||
        error.message?.toLowerCase().includes('failed to connect to server') ||
        error.message?.toLowerCase().includes('server selection timed out') 
       ) {
      errorMessage = 'Database Connection Error.';
      errorDetails = `Could not connect to the database server: ${error.message}. Please check your MONGODB_URI, network configuration, and ensure the MongoDB server is running and accessible. If you are the site administrator, verify these settings.`;
      statusCode = 503; 
    } else if (error.name === 'MongoServerError' || error.name === 'MongoAPIError') {
      errorMessage = 'Database Operation Failed.';
      errorDetails = `A database server error occurred: ${error.message}`;
    } else if (error.message?.includes("Authentication failed")) {
        errorMessage = 'Database Authentication Failed.';
        errorDetails = `Could not authenticate with the database: ${error.message}. Site administrator: please check your MONGODB_URI credentials.`;
        statusCode = 503; // Service Unavailable, as it's a server config issue from user's POV
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
