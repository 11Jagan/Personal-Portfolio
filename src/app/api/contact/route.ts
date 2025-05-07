
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// import { clientPromise, MONGODB_DB_NAME } from '@/lib/mongodb'; // MongoDB client no longer used by this form

// Schema for validating contact form data (can still be useful if API is repurposed)
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: NextRequest) {
  console.info("/api/contact POST: Request received at", new Date().toISOString());
  console.warn("/api/contact POST: This API endpoint is no longer used for direct form submissions. The contact form now uses a 'mailto:' link to open the user's email client.");

  return NextResponse.json(
    {
      message: 'This API endpoint is not intended for direct form submission. The contact form uses a mailto: link.',
      info: 'If you are developing and need to test this endpoint, ensure you are sending a valid JSON body.'
    },
    { status: 405 } // Method Not Allowed (or a custom status indicating its change of purpose)
  );

  // All MongoDB related logic below is commented out as per the new requirement.
  // If this API route were to be used for other purposes with MongoDB,
  // the MONGODB_URI and related checks would be relevant again.

  /*
  // Check if MONGODB_URI was set and clientPromise was initialized.
  if (!clientPromise) {
    const serverErrorMessage = "CRITICAL_SERVER_CONFIG_ERROR: MongoDB connection is not configured or failed to initialize.";
    const clientErrorDetails = "The MongoDB connection string (MONGODB_URI) is missing, invalid, or the placeholder value is still in use. Please check your .env.local file or deployment environment variables. Refer to README.md for setup instructions.";
    
    console.error(`${serverErrorMessage} Details: ${clientErrorDetails}`);
    return NextResponse.json(
      {
        error: 'MongoDB Configuration Error',
        details: clientErrorDetails,
      },
      { status: 503 } 
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
      console.error("/api/contact POST: Failed to save message to MongoDB. No insertedId returned.");
      return NextResponse.json({ error: 'Failed to save message to database.', details: 'Database operation did not confirm insertion.' }, { status: 500 });
    }

  } catch (error: any) {
    let errorMessage = 'An unexpected internal server error occurred while processing your message.';
    let errorDetails = error.message || 'No additional details provided.';
    let statusCode = 500;

    console.error('CRITICAL_ERROR in /api/contact POST handler (MongoDB interaction):', error.message, error.stack, { originalError: error });
    
    if (error.name === 'MongoNetworkError' || 
        error.message.includes('connect ETIMEDOUT') || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect ECONNREFUSED') || 
        (error.message && error.message.toLowerCase().includes('failed to connect to server')) ||
        (error.message && error.message.toLowerCase().includes('server selection timed out')) 
       ) {
      errorMessage = 'Database Connection Error.';
      errorDetails = `Could not connect to the database server: ${error.message}. Please check your MONGODB_URI, network configuration, and ensure the MongoDB server is running and accessible.`;
      statusCode = 503; 
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
        statusCode = 401; 
    } else if (error.name === 'MongoParseError') { 
        errorMessage = 'Invalid MongoDB URI Format.';
        errorDetails = `The provided MONGODB_URI is not valid: ${error.message}. Please ensure it starts with "mongodb://" or "mongodb+srv://".`;
        statusCode = 500; 
    }
        
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails 
      }, 
      { status: statusCode }
    );
  }
  */
}

```