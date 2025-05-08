
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';

// Define the schema for contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      console.error("API Validation Error:", parsedData.error.format());
      return NextResponse.json({ 
        error: 'Invalid input data.', 
        details: parsedData.error.format() 
      }, { status: 400 });
    }

    const { name, email, subject, message } = parsedData.data;

    const db = await connectToDatabase();
    const messagesCollection = db.collection('messages');

    const result = await messagesCollection.insertOne({
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
      status: "unread", // Default status for new messages
    });

    if (result.insertedId) {
      console.log("API: Message saved to MongoDB with ID:", result.insertedId);
      return NextResponse.json({ 
        message: 'Message received and stored successfully!', 
        data: { id: result.insertedId, ...parsedData.data }
      }, { status: 200 });
    } else {
      // This case should ideally not be reached if insertOne throws an error on failure,
      // but as a fallback.
      console.error("API: Failed to insert message into MongoDB (no insertedId returned).");
      return NextResponse.json({ error: 'Failed to store message in database due to an unexpected issue.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Route Error:', error); // Log the full error on the server

    let errorMessage = 'Internal Server Error. Please try again later.'; // Default user-facing message

    // Check for specific error types or properties to provide more context
    if (error.name === 'MongoNetworkError' || (error.message && error.message.toLowerCase().includes('mongo'))) {
      errorMessage = 'Database connection error. Please verify your MONGODB_URI in .env.local, check network access rules in MongoDB Atlas (if applicable), and ensure your database server is running.';
    } else if (error.message && typeof error.message === 'string' && error.message.trim() !== '') {
      // Use the error's message if it's a non-empty string
      errorMessage = error.message;
    }
    
    // Override with a more specific message if environment variables are missing, as this is a common setup issue.
    if (!process.env.MONGODB_URI || !process.env.MONGODB_DB_NAME) {
        console.error("API Route Critical Error: MONGODB_URI or MONGODB_DB_NAME environment variable is not set in .env.local.");
        errorMessage = "Server configuration error: Database connection details (MONGODB_URI or MONGODB_DB_NAME) are missing in .env.local. Please contact the administrator or check your server setup.";
    }
    
    // Ensure errorMessage is always a non-empty string before sending
    const finalErrorMessage = (typeof errorMessage === 'string' && errorMessage.trim() !== '') ? errorMessage : 'An unexpected server error occurred.';

    return NextResponse.json({ error: finalErrorMessage }, { status: 500 });
  }
}

