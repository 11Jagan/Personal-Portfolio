# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project requires certain environment variables to be set for full functionality, especially for database connections (used by the Contact Form) and GenAI features.

Create a `.env.local` file in the root of your project and add the following variables. **You MUST replace placeholder values with your actual credentials for the features to work.**

```env
# MongoDB Configuration (REQUIRED for the Contact Form)
# ------------------------------------------------------
# CRITICAL: The contact form WILL NOT WORK without a valid MONGODB_URI.
# Replace "YOUR_MONGODB_CONNECTION_STRING" with your actual MongoDB connection string.
# Example for MongoDB Atlas: MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority"
# Example for local MongoDB: MONGODB_URI="mongodb://localhost:27017/your_db_name"
MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"

# Optional: Specify the database name. If not set, it defaults to "portfolio_jmr".
MONGODB_DB_NAME="portfolio_jmr"

# Google Generative AI API Key (if using Genkit with Google AI models)
# GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"

# Firebase Configuration (if using Firebase features beyond what's pre-configured)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
# NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Gmail Configuration for Firebase Functions (if using email notifications via Firebase Functions)
# GMAIL_EMAIL="YOUR_GMAIL_ADDRESS"
# GMAIL_PASSWORD="YOUR_GMAIL_APP_PASSWORD_OR_OAUTH_TOKEN"
```

**Important Notes:**
-   **MongoDB Setup is Crucial:**
    *   The Contact Form **WILL NOT WORK** without a valid `MONGODB_URI`.
    *   You must replace `"YOUR_MONGODB_CONNECTION_STRING"` with your actual MongoDB connection string. You can get this from your MongoDB Atlas dashboard or your self-hosted MongoDB instance.
    *   Ensure the connection string starts with `mongodb://` or `mongodb+srv://`.
    *   The `MONGODB_DB_NAME` defaults to `portfolio_jmr` but can be changed. If you include the database name in your `MONGODB_URI`, this variable can be omitted or should match.
-   The `GOOGLE_GENAI_API_KEY` is needed if you intend to use Genkit with Google AI models.
-   Fill in the Firebase and Gmail credentials only if you are implementing features that require them.
-   **Never commit your `.env.local` file to a public repository.** It is included in `.gitignore` by default.
-   **After creating or modifying `.env.local`, you MUST restart your Next.js development server** for the changes to take effect.

To run the application locally after setting up your `.env.local` file:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

If you are deploying this application, ensure these environment variables are configured in your deployment environment's settings.

## Troubleshooting

### Contact Form Error: "MongoDB Configuration Error" or "Database Unavailable"

If you see an error message like:
`Submission Error: MongoDB Configuration Error. Details: The MongoDB connection string (MONGODB_URI) is missing, invalid, or the placeholder value is still in use...`

This means the application cannot connect to your MongoDB database. Please verify the following:
1.  **`.env.local` File**:
    *   Ensure the `.env.local` file exists in the root of your project.
    *   Check that `MONGODB_URI` is defined in this file.
    *   Confirm that you have replaced `"YOUR_MONGODB_CONNECTION_STRING"` with your actual, valid connection string.
    *   Verify the scheme: it must start with `mongodb://` or `mongodb+srv://`.
2.  **MongoDB Server**:
    *   Ensure your MongoDB server (local or cloud-hosted like Atlas) is running and accessible from your development machine or deployment environment.
    *   Check firewall rules if applicable.
    *   For MongoDB Atlas, ensure your current IP address is whitelisted for database access.
3.  **Restart Server**: After making any changes to `.env.local`, restart your Next.js development server (e.g., stop `npm run dev` and start it again).
4.  **Deployment Environment**: If deployed, double-check that `MONGODB_URI` (and `MONGODB_DB_NAME` if used) are correctly set as environment variables in your hosting provider's settings.
5.  **Server Logs**: Check the server-side console output of your Next.js application for more detailed error messages from the MongoDB driver (e.g., `CRITICAL_MONGODB_CONFIG` or `CRITICAL_MONGODB_SETUP_FAILED`). These logs can provide more specific clues about authentication failures, network issues, or parsing errors with the URI.
```