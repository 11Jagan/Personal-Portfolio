
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
      console.error("API: Failed to insert message into MongoDB");
      return NextResponse.json({ error: 'Failed to store message in database.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Route Error:', error);
    let errorMessage = 'Internal Server Error.';
    if (error.name === 'MongoNetworkError') {
      errorMessage = 'Database connection error. Please check your MONGODB_URI and network access rules.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Check if MONGODB_URI is missing, as it's a common setup issue
    if (!process.env.MONGODB_URI) {
        console.error("API Route Error: MONGODB_URI environment variable is not set.");
        errorMessage = "Server configuration error: Database URI is missing. Please contact the administrator.";
    }


    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
