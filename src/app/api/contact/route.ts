
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
// Removed: import * as logger from 'firebase-functions/logger'; // Not used in client-side API route

// Schema for validating contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Helper function to check for missing Firebase configuration variables
function checkFirebaseConfig(): string[] {
  const missingVars: string[] = [];
  if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain) missingVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.storageBucket) missingVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!firebaseConfig.messagingSenderId) missingVars.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!firebaseConfig.appId) missingVars.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  return missingVars;
}

let appInstance: FirebaseApp | null = null;
let functionsInstance: Functions | null = null;

// Initialize Firebase services (app, Functions)
function initializeFirebaseServices(): { functions: Functions } {
  if (!appInstance) {
    const missingConfigVars = checkFirebaseConfig();
    if (missingConfigVars.length > 0) {
      const errorMsg = `Firebase client configuration is incomplete for the API route. Missing: ${missingConfigVars.join(', ')}. Cannot process request. Please ensure these NEXT_PUBLIC_FIREBASE_ environment variables are set.`;
      console.error("CRITICAL_FIREBASE_CONFIG_API_ROUTE:", errorMsg); // This log is crucial for server-side debugging
      throw new Error(errorMsg);
    }

    if (!getApps().length) {
      console.info("API Route: Initializing new Firebase app instance.");
      appInstance = initializeApp(firebaseConfig);
    } else {
      console.info("API Route: Getting existing Firebase app instance.");
      appInstance = getApp();
    }
  }

  if (!functionsInstance) {
    functionsInstance = getFunctions(appInstance);
  }
  return { functions: functionsInstance };
}

export async function POST(request: NextRequest) {
  console.info("/api/contact POST: Request received at", new Date().toISOString());
  
  try {
    // Check Firebase config first. This will throw if incomplete.
    const { functions: firebaseFunctions } = initializeFirebaseServices();
    console.info("/api/contact POST: Firebase services initialized/obtained.");

    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.warn("/api/contact POST: Error parsing request JSON:", parseError.message);
      return NextResponse.json({ error: 'Invalid JSON in request body', details: parseError.message }, { status: 400 });
    }
    
    console.info("/api/contact POST: Request body parsed:", body);
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      console.warn("/api/contact POST: Invalid input data from client:", parsedData.error.format());
      return NextResponse.json({ error: 'Invalid input data', details: parsedData.error.format() }, { status: 400 });
    }
    console.info("/api/contact POST: Input data validated successfully. Proceeding to call Cloud Function.");

    const { name, email, subject, message } = parsedData.data;

    let emailNotificationError = null;
    try {
      console.info("/api/contact POST: Attempting to call 'sendContactEmail' Cloud Function with data:", { name, email, subject, message });
      const sendContactEmailCallable = httpsCallable(firebaseFunctions, 'sendContactEmail');
      const emailResult = await sendContactEmailCallable({ name, email, subject, message });
      
      const emailResultData = emailResult.data as { success?: boolean; message?: string; error?: string };
      console.info("/api/contact POST: 'sendContactEmail' Cloud Function returned:", emailResultData);

      if (!emailResultData || typeof emailResultData.success === 'undefined') {
        emailNotificationError = "Cloud Function returned an unexpected response format.";
        console.error("/api/contact POST: Cloud Function response format error:", emailResultData);
      } else if (!emailResultData.success) {
        emailNotificationError = emailResultData.error || emailResultData.message || "Cloud Function indicated email sending failed.";
        console.error("/api/contact POST: Cloud Function email sending failed:", emailNotificationError);
      } else {
        console.info("/api/contact POST: Cloud Function for email sending reported success.");
      }
    } catch (error: any) {
      console.error("/api/contact POST: Error calling 'sendContactEmail' Cloud Function:", error.code, error.message, error.details, error.stack);
      let errorMessage = 'The email notification service encountered an error.';
      if (error.code && error.message) {
         errorMessage += ` Code: ${error.code}, Message: ${error.message}. Check Firebase Function logs for 'sendContactEmail'.`;
      } else if (error.message) {
        errorMessage += ` Message: ${error.message}. Check Firebase Function logs for 'sendContactEmail'.`;
      } else {
        errorMessage += " An unknown error occurred while calling the function. Check Firebase Function logs for 'sendContactEmail'.";
      }
      emailNotificationError = errorMessage;
    }

    if (emailNotificationError) {
      // This error is specifically from the Cloud Function call or its response
      return NextResponse.json({ 
        error: 'Failed to process email notification via Cloud Function.', 
        details: emailNotificationError 
      }, { status: 500 });
    }

    console.info("/api/contact POST: Request processed successfully. Email notification initiated.");
    return NextResponse.json({ message: 'Message sent successfully via API route!', data: parsedData.data }, { status: 200 });

  } catch (error: any) {
    // This outer catch handles errors from initializeFirebaseServices or other unexpected issues within this API route.
    const errorMessage = error.message || 'No additional details provided.';
    const errorStack = error.stack || 'No stack trace available.';
    console.error('CRITICAL_ERROR in /api/contact POST handler:', errorMessage, errorStack, { originalError: error });
    
    let publicErrorMessage = 'An unexpected internal server error occurred in the API route.';
    
    if (errorMessage.includes("Firebase client configuration is incomplete")) {
      // This is the expected error if env vars are missing for the API route client
      publicErrorMessage = `Server Configuration Error: ${errorMessage} Please check server logs and ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set for the API route.`;
    } else if (errorMessage.includes("Failed to initialize Firebase")) { 
      publicErrorMessage = `Server setup error: ${errorMessage}`;
    }
        
    console.error("/api/contact POST: Sending error response due to critical failure:", { error: publicErrorMessage, details: errorMessage });
    return NextResponse.json({ 
      error: publicErrorMessage, 
      details: `Original error in API route: ${errorMessage}`
    }, { status: 500 });
  }
}
