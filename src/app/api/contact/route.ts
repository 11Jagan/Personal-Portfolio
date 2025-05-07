
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';

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

// Helper function to check for missing or placeholder Firebase configuration variables
function checkFirebaseConfig(): { missing: string[], placeholderProjectId: boolean, actualProjectId: string | undefined } {
  const missingVars: string[] = [];
  let placeholderProjectId = false;

  if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain) missingVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  
  if (!firebaseConfig.projectId) {
    missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  } else if (firebaseConfig.projectId === "YOUR_FIREBASE_PROJECT_ID_HERE" || 
             firebaseConfig.projectId.toUpperCase().includes("YOUR_") || 
             firebaseConfig.projectId.toUpperCase().includes("_HERE")) {
    placeholderProjectId = true;
  }

  if (!firebaseConfig.storageBucket) missingVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!firebaseConfig.messagingSenderId) missingVars.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!firebaseConfig.appId) missingVars.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  
  return { missing: missingVars, placeholderProjectId: placeholderProjectId, actualProjectId: firebaseConfig.projectId };
}

let appInstance: FirebaseApp | null = null;
let functionsInstance: Functions | null = null;

// Initialize Firebase services (app, Functions)
function initializeFirebaseServices(): { app: FirebaseApp, functions: Functions } {
  if (!appInstance) { // Only attempt initialization if not already done
    const { missing: missingConfigVars, placeholderProjectId, actualProjectId } = checkFirebaseConfig();
    const errorMessages: string[] = [];

    if (missingConfigVars.length > 0) {
      errorMessages.push(`Missing critical Firebase environment variables: ${missingConfigVars.join(', ')}.`);
    }
    if (placeholderProjectId) {
      errorMessages.push(`The Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is set to a placeholder value: "${actualProjectId}".`);
    }

    if (errorMessages.length > 0) {
      const fullErrorMsg = `Firebase client configuration error: ${errorMessages.join(' ')} Cannot initialize Firebase services. Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set in your environment (e.g., .env.local file) with your actual Firebase project credentials.`;
      console.error("CRITICAL_FIREBASE_CONFIG_API_ROUTE:", fullErrorMsg, "Current Config for Logging (sensitive values like apiKey are generalized):", {
        apiKeySet: !!firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderIdSet: !!firebaseConfig.messagingSenderId,
        appIdSet: !!firebaseConfig.appId,
      });
      throw new Error(fullErrorMsg);
    }

    // Proceed with initialization if config is valid
    if (!getApps().length) {
      console.info(`API Route: Initializing new Firebase app instance for project ID: ${firebaseConfig.projectId}.`);
      appInstance = initializeApp(firebaseConfig);
    } else {
      console.info(`API Route: Getting existing Firebase app instance for project ID: ${firebaseConfig.projectId}.`);
      appInstance = getApp();
    }
  }

  if (appInstance && !functionsInstance) {
    functionsInstance = getFunctions(appInstance);
    console.info(`API Route: Firebase Functions initialized for project ID: ${appInstance.options.projectId}.`);
  }
  
  if (!appInstance || !functionsInstance) {
    // This case should ideally be caught by the config checks, but as a safeguard:
    console.error("CRITICAL_FIREBASE_INIT_FAILURE: Firebase app or functions instance is null after attempting initialization. This should not happen if config checks passed.");
    throw new Error("Failed to initialize Firebase app or functions. This is an unexpected server state. Check server logs for CRITICAL_FIREBASE_CONFIG_API_ROUTE messages.");
  }

  return { app: appInstance, functions: functionsInstance };
}

export async function POST(request: NextRequest) {
  console.info("/api/contact POST: Request received at", new Date().toISOString());
  console.info("/api/contact POST: Attempting to use Firebase Project ID from env:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET in environment variables");
  
  try {
    // Initialize services. This will throw if config is bad.
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
        emailNotificationError = "Cloud Function 'sendContactEmail' returned an unexpected response format.";
        console.error("/api/contact POST: Cloud Function response format error:", emailResultData);
      } else if (!emailResultData.success) {
        emailNotificationError = emailResultData.error || emailResultData.message || "Cloud Function 'sendContactEmail' indicated email sending failed.";
        console.error("/api/contact POST: Cloud Function 'sendContactEmail' email sending failed:", emailNotificationError);
      } else {
        console.info("/api/contact POST: Cloud Function for 'sendContactEmail' reported success.");
      }
    } catch (error: any) {
      console.error("/api/contact POST: Error calling 'sendContactEmail' Cloud Function:", error.code, error.message, error.details, error.stack);
      let errorMessage = 'The email notification service encountered an error.';
      
      // Use the projectId from the successfully initialized appInstance for more accurate error reporting
      const currentProjectId = appInstance?.options.projectId || firebaseConfig.projectId || "Project ID Not Configured";

      if (error.code === 'functions/not-found') {
        errorMessage = `The 'sendContactEmail' Cloud Function was not found in your Firebase project (ID: '${currentProjectId}'). Please ensure the function is correctly deployed to this project and its region. Original error: ${error.message}.`;
      } else if (error.code && error.message) {
         errorMessage += ` Code: ${error.code}, Message: ${error.message}. Check Firebase Function logs for 'sendContactEmail' in project '${currentProjectId}'.`;
      } else if (error.message) {
        errorMessage += ` Message: ${error.message}. Check Firebase Function logs for 'sendContactEmail' in project '${currentProjectId}'.`;
      } else {
        errorMessage += ` An unknown error occurred while calling the 'sendContactEmail' function for project '${currentProjectId}'. Check Firebase Function logs.`;
      }
      emailNotificationError = errorMessage;
    }

    if (emailNotificationError) {
      return NextResponse.json({ 
        error: 'Failed to process email notification via Cloud Function.', 
        details: emailNotificationError 
      }, { status: 500 });
    }

    console.info("/api/contact POST: Request processed successfully. Email notification via 'sendContactEmail' initiated.");
    return NextResponse.json({ message: 'Message sent successfully via API route!', data: parsedData.data }, { status: 200 });

  } catch (error: any) {
    const errorMessage = error.message || 'No additional details provided.';
    const errorStack = error.stack || 'No stack trace available.';
    console.error('CRITICAL_ERROR in /api/contact POST handler:', errorMessage, errorStack, { originalError: error });
    
    let publicErrorMessage = 'An unexpected internal server error occurred in the API route.';
    
    if (errorMessage.includes("Firebase client configuration error")) { // Matches the specific error from initializeFirebaseServices
      publicErrorMessage = `Server Configuration Error: ${errorMessage}. Please check server logs and ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set with your actual Firebase project credentials.`;
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
