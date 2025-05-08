
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

Create a `.env.local` file in the root of your project:

```env
# MongoDB Configuration (Required for Contact Form)
MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
MONGODB_DB_NAME="YOUR_MONGODB_DATABASE_NAME" # e.g., portfolio_messages

# Google Generative AI API Key (if using Genkit with Google AI models)
# GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"

# Firebase Configuration (if using other Firebase features)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
# NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

**Important Notes for Contact Form & `.env.local`:**
-   **Contact Form:** The contact form uses a backend API route (`/api/contact`) to save messages to a MongoDB database.
    -   You **MUST** set up a MongoDB database (e.g., using MongoDB Atlas free tier).
    -   Replace `YOUR_MONGODB_CONNECTION_STRING` with your actual MongoDB connection string.
    -   Replace `YOUR_MONGODB_DATABASE_NAME` with the name of the database you want to use (e.g., `portfolio_jmr`). Messages will be stored in a collection named `messages` within this database.
-   The `GOOGLE_GENAI_API_KEY` is needed if you intend to use Genkit with Google AI models.
-   Fill in the Firebase credentials only if you are implementing features that require them.
-   **Never commit your `.env.local` file to a public repository.** It is included in `.gitignore` by default.
-   **After creating or modifying `.env.local`, you MUST restart your Next.js development server** for the changes to take effect.

To run the application locally:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

If you are deploying this application, ensure your MongoDB database is accessible from your deployment environment and the environment variables are correctly set.

## Troubleshooting

### Contact Form Submissions

-   **MongoDB Configuration:**
    -   Ensure `MONGODB_URI` and `MONGODB_DB_NAME` are correctly set in your `.env.local` file and that you've restarted your development server.
    -   Verify your MongoDB connection string is correct and allows connections from your application's IP address (especially if using MongoDB Atlas, check IP Access List).
    -   Check your MongoDB server logs for any connection errors.
-   **Console Errors:** Open your browser's developer console (usually F12) and the terminal running your Next.js dev server. Check for any error messages when you submit the form.
-   **Toast Notifications:**
    -   The website provides toast notifications upon form submission (e.g., "Message Sent!", "Submission Error"). These give clues about the outcome.

### Mailto Links (Direct Contact Methods)

The "Contact Details" card and the footer still contain direct `mailto:` links (e.g., for the email icon). These will open the visitor's default email application and are independent of the MongoDB-backed contact form.
