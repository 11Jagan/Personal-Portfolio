
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// MongoDB client and related imports are not used by this endpoint's current mailto: strategy
// import { clientPromise, MONGODB_DB_NAME } from '@/lib/mongodb'; 

// Schema for validating contact form data (can still be useful if API is repurposed or for other forms)
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: NextRequest) {
  const requestTimestamp = new Date().toISOString();
  console.info(`/api/contact POST: Request received at ${requestTimestamp}`);
  console.warn(`/api/contact POST: This API endpoint is currently NOT USED for portfolio contact form submissions. The contact form uses a "mailto:" link to open the user's email client directly. If you see requests here, they might be from old cached versions, direct API calls, or if the frontend logic was changed back to use this endpoint.`);

  // If you intend to use this endpoint for other purposes or re-enable backend processing,
  // you would uncomment and use the MongoDB logic below.
  // For now, it returns a clear message and 405 Method Not Allowed.

  return NextResponse.json(
    {
      message: 'This API endpoint is not used for the primary contact form. The contact form uses a mailto: link to open the user\'s email client.',
      info: 'If you are developing a feature that uses this endpoint, ensure you are sending a valid JSON body and have configured any necessary backend services (e.g., MongoDB, email service).',
      timestamp: requestTimestamp,
    },
    { status: 405 } // 405 Method Not Allowed
  );

  /*
  // ------------ START: Commented out MongoDB/backend logic ------------
  // This section would be used if the form submitted to this backend API
  // instead of using a mailto: link.

  // Check if MONGODB_URI was set and clientPromise was initialized.
  // Note: This check relies on how `clientPromise` is exported from '@/lib/mongodb'.
  // If MONGODB_URI is not set, clientPromise might be null or throw an error upon access.
  // The `mongodb.ts` file itself logs warnings/errors if MONGODB_URI is missing.
  
  // A more direct check before trying to use clientPromise:
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === "YOUR_MONGODB_CONNECTION_STRING") {
    const serverErrorMessage = "CRITICAL_SERVER_CONFIG_ERROR: MongoDB connection string (MONGODB_URI) is not configured or is set to the placeholder value.";
    const clientErrorDetails = "The MongoDB URI is missing or invalid. This API endpoint requires MongoDB to store messages. Please check your .env.local file or deployment environment variables. Refer to README.md for setup instructions.";
    
    console.error(`${serverErrorMessage} Details: ${clientErrorDetails}`);
    return NextResponse.json(
      {
        error: 'MongoDB Configuration Error',
        details: clientErrorDetails,
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
    // Ensure clientPromise is not null (it would be if MONGODB_URI was invalid/missing)
    if (!clientPromise) {
        // This case should ideally be caught by the MONGODB_URI check above, 
        // but as a fallback if clientPromise was nullified for other reasons.
        console.error("/api/contact POST: clientPromise is null, MongoDB connection not available.");
        return NextResponse.json({ error: 'Database service not available.' }, { status: 503 });
    }

    const awaitedClient = await clientPromise; 
    const db = awaitedClient.db(MONGODB_DB_NAME); // MONGODB_DB_NAME from mongodb.ts
    const collection = db.collection("messages"); // Collection name

    console.info(`/api/contact POST: Attempting to insert message into MongoDB database '${MONGODB_DB_NAME}', collection 'messages'.`);
    
    const result = await collection.insertOne({
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
      status: "unread", // Example: a status field
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
      // This scenario (no insertedId but no error) is less common with modern drivers but good to handle.
      return NextResponse.json({ error: 'Failed to save message to database.', details: 'Database operation did not confirm insertion.' }, { status: 500 });
    }

  } catch (error: any) {
    let errorMessage = 'An unexpected internal server error occurred while processing your message.';
    let errorDetails = error.message || 'No additional details provided.';
    let statusCode = 500;

    console.error('CRITICAL_ERROR in /api/contact POST handler (MongoDB interaction):', error.message, error.stack, { originalError: error });
    
    // Specific MongoDB error handling (subset from previous version)
    if (error.name === 'MongoNetworkError' || 
        error.message?.includes('connect ETIMEDOUT') || 
        error.message?.includes('ECONNREFUSED') ||
        error.message?.toLowerCase().includes('failed to connect to server') ||
        error.message?.toLowerCase().includes('server selection timed out') 
       ) {
      errorMessage = 'Database Connection Error.';
      errorDetails = `Could not connect to the database server: ${error.message}. Please check your MONGODB_URI, network configuration, and ensure the MongoDB server is running and accessible.`;
      statusCode = 503; // Service Unavailable
    } else if (error.name === 'MongoServerError' || error.name === 'MongoAPIError') {
      errorMessage = 'Database Operation Failed.';
      errorDetails = `A database server error occurred: ${error.message}`;
    } else if (error.message?.includes("Authentication failed")) {
        errorMessage = 'Database Authentication Failed.';
        errorDetails = `Could not authenticate with the database: ${error.message}. Please check your MONGODB_URI credentials.`;
        statusCode = 401; // Unauthorized
    }
        
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails 
      }, 
      { status: statusCode }
    );
  }
  // ------------ END: Commented out MongoDB/backend logic ------------
  */
}
