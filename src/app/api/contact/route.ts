
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Schema for validating contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// Path to the local JSON file for storing messages
const MESSAGES_FILE_PATH = path.join(process.cwd(), 'data', 'messages.json');
const DATA_DIR_PATH = path.join(process.cwd(), 'data');

// Ensure the data directory exists
async function ensureDataDirExists() {
  try {
    await fs.mkdir(DATA_DIR_PATH, { recursive: true });
    console.info(`Data directory ensured at: ${DATA_DIR_PATH}`);
  } catch (error: any) {
    console.error('Error creating data directory:', error.message);
    // If we can't create the directory, we can't save messages.
    // This is a critical setup error for this storage method.
    throw new Error(`Failed to create data directory: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  const requestTimestamp = new Date().toISOString();
  console.info(`/api/contact POST: Request received at ${requestTimestamp}`);

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
  const newMessage = {
    id: crypto.randomUUID(), // Generate a unique ID for the message
    name,
    email,
    subject,
    message,
    submittedAt: new Date(),
    status: "unread", 
  };

  try {
    await ensureDataDirExists(); // Make sure the 'data' directory exists

    let messages: any[] = [];
    try {
      const fileContents = await fs.readFile(MESSAGES_FILE_PATH, 'utf-8');
      messages = JSON.parse(fileContents);
      if (!Array.isArray(messages)) { // Basic validation
        console.warn("/api/contact POST: messages.json content is not an array. Re-initializing.");
        messages = [];
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.info("/api/contact POST: messages.json not found. Will create a new one.");
        // File doesn't exist, which is fine, we'll create it.
      } else {
        // Other read errors (permissions, corruption)
        console.error("/api/contact POST: Error reading messages.json:", error.message);
        return NextResponse.json({ error: 'Failed to read existing messages', details: error.message }, { status: 500 });
      }
    }

    messages.push(newMessage);

    await fs.writeFile(MESSAGES_FILE_PATH, JSON.stringify(messages, null, 2), 'utf-8');
    console.info(`/api/contact POST: Message successfully saved to ${MESSAGES_FILE_PATH}`);

    return NextResponse.json(
      { 
        message: 'Message sent successfully and saved locally!', 
        data: newMessage 
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('CRITICAL_ERROR in /api/contact POST handler (file system interaction):', error.message, error.stack, { originalError: error });
    return NextResponse.json(
      { 
        error: 'Failed to save message locally.', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
