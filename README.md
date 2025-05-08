
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project's contact form **requires MongoDB** to store submitted messages. You will need to set up a MongoDB instance (e.g., MongoDB Atlas or a local instance) and provide the connection string.

Create a `.env.local` file in the root of your project.

```env
# MongoDB Configuration (REQUIRED for Contact Form)
# --------------------------------------------------------------------
# The contact form submits data to a backend API which stores messages in MongoDB.
# You MUST set MONGODB_URI to a valid connection string.
# Example for MongoDB Atlas: MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority"
# Example for local MongoDB: MONGODB_URI="mongodb://localhost:27017/your_db_name"
MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"

# Optional: Specify the database name if it's not part of your MONGODB_URI. Defaults to "portfolio_jmr".
# MONGODB_DB_NAME="portfolio_jmr"

# Google Generative AI API Key (if using Genkit with Google AI models)
# GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"

# Firebase Configuration (if using Firebase features beyond what's pre-configured)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
# NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Gmail Configuration for Firebase Functions (if you implement email notifications via Firebase Functions)
# GMAIL_EMAIL="YOUR_GMAIL_ADDRESS"
# GMAIL_PASSWORD="YOUR_GMAIL_APP_PASSWORD_OR_OAUTH_TOKEN"
```

**Important Notes for `.env.local`:**
-   **Contact Form:** The contact form now submits data to the `/api/contact` backend endpoint, which saves messages to a MongoDB database. **`MONGODB_URI` MUST be set correctly for the contact form to work.**
    *   If `MONGODB_URI` is not set, is empty, or is still the placeholder `"YOUR_MONGODB_CONNECTION_STRING"`, the application will log critical errors to the server console, and the contact form submissions will fail.
    *   Ensure your MongoDB server (local or cloud-hosted like Atlas) is running and accessible. For Atlas, whitelist your IP address.
-   The `GOOGLE_GENAI_API_KEY` is needed if you intend to use Genkit with Google AI models.
-   Fill in the Firebase and Gmail credentials only if you are implementing features that require them.
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

If you are deploying this application, ensure `MONGODB_URI` (and other necessary environment variables like `GOOGLE_GENAI_API_KEY` if used) are configured in your deployment environment's settings.

## Troubleshooting

### Contact Form Submissions Failing / "Server Error" Messages

If the contact form shows an error like "Server Configuration Error", "Database Initialization Error", or "Message submission failed" when you try to send a message:

1.  **Check `MONGODB_URI` in `.env.local` (Most Common Issue):**
    *   Verify that the `.env.local` file exists in the root of your project.
    *   **Crucially, ensure `MONGODB_URI` is set to your actual, valid MongoDB connection string.** It must NOT be empty or the placeholder value (`"YOUR_MONGODB_CONNECTION_STRING"`).
    *   Confirm the scheme: it must start with `mongodb://` or `mongodb+srv://`.
2.  **Server-Side Logs:**
    *   Check the terminal where your Next.js development server (`npm run dev`) is running.
    *   Look for error messages starting with `CRITICAL_MONGODB_CONFIG...`, `CRITICAL_SERVER_CONFIG_ERROR...`, or `CRITICAL_MONGODB_SETUP_FAILED...`. These messages provide specific details about why the MongoDB connection might be failing (e.g., missing URI, invalid URI scheme, connection timeout, authentication failure).
3.  **MongoDB Server Accessibility:**
    *   Ensure your MongoDB server (local instance or a cloud-hosted one like MongoDB Atlas) is running.
    *   If using MongoDB Atlas, make sure your current IP address is whitelisted for database access in the Atlas project settings (Network Access).
    *   Check firewall rules if applicable on your local machine or network.
4.  **Restart Next.js Server:**
    *   After making any changes to `.env.local` or your MongoDB setup, **you MUST restart your Next.js development server** (stop `npm run dev` and run it again).
5.  **Deployment Environment (if applicable):**
    *   If you have deployed the application, ensure `MONGODB_URI` is correctly set as an environment variable in your hosting provider's settings.
6.  **Toast Notifications:**
    *   The website provides toast notifications upon form submission (e.g., "Message Sent!", "Submission Error", "Network Error"). These give clues about the outcome of the submission attempt from the frontend's perspective.
    *   If you see "Server error (status 500/503): An HTML error page was returned..." or similar, it means the backend API route (`/api/contact`) itself crashed. The server-side logs (Step 2) are essential for diagnosing this.

### Mailto Links (Direct Contact Methods)

The "Contact Details" card and the footer still contain direct `mailto:` links (e.g., for the email icon). These will open the visitor's default email application and are independent of the main contact form's MongoDB integration.
```