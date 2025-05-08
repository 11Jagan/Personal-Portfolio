
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project uses a `mailto:` link for its primary contact form, so it does **not** require MongoDB for that functionality. You will receive messages via your email client.

However, environment variables might be needed for other features (like GenAI or future database integrations).

Create a `.env.local` file in the root of your project.

```env
# MongoDB Configuration (OPTIONAL - Not Required for the Contact Form)
# --------------------------------------------------------------------
# The contact form uses a "mailto:" link and does NOT need MongoDB.
# Set these variables ONLY if you plan to add other features that require MongoDB.
# If MONGODB_URI is set, it should be a valid connection string.
# Example for MongoDB Atlas: MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority"
# Example for local MongoDB: MONGODB_URI="mongodb://localhost:27017/your_db_name"
# MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"

# Optional: Specify the database name if using MongoDB for other features. Defaults to "portfolio_jmr".
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

# Gmail Configuration for Firebase Functions (if using email notifications via Firebase Functions for OTHER features)
# GMAIL_EMAIL="YOUR_GMAIL_ADDRESS"
# GMAIL_PASSWORD="YOUR_GMAIL_APP_PASSWORD_OR_OAUTH_TOKEN"
```

**Important Notes for `.env.local`:**
-   **Contact Form:** Uses a `mailto:` link and does **not** require `MONGODB_URI` to be set. When a visitor submits the form, it attempts to open their default email application with a pre-filled email addressed to `konthamjaganmohanreddy@gmail.com`. The visitor then needs to click "Send" in their email client.
-   **MongoDB Setup (for other features):**
    *   If you decide to use MongoDB for features *other than the contact form*, and you set `MONGODB_URI` in `.env.local`, ensure it's a valid connection string.
    *   If `MONGODB_URI` is set but invalid or still the placeholder, any features attempting to connect to MongoDB will fail, and you may see errors in the server console.
-   The `GOOGLE_GENAI_API_KEY` is needed if you intend to use Genkit with Google AI models.
-   Fill in the Firebase and Gmail credentials only if you are implementing features that require them (currently, no default components actively use these).
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

If you are deploying this application, ensure any necessary environment variables (like `GOOGLE_GENAI_API_KEY` if used) are configured in your deployment environment's settings.

## Troubleshooting

### Contact Form Behavior (Mailto Link)

The contact form is designed to open the visitor's default email application (e.g., Outlook, Apple Mail, Thunderbird, or the Gmail web interface if configured as the default mailto handler in their browser). The email will be pre-filled and addressed to `konthamjaganmohanreddy@gmail.com`. The visitor must then click "Send" in their own email client to dispatch the message.

If the email client does not open, or if you (JMR) are not receiving messages:
1.  **Visitor's Email Client Configuration:** The visitor must have a default email client properly configured on their operating system or browser for `mailto:` links to work. This is outside the control of the website.
2.  **Recipient Email Address:** The recipient email is hardcoded in `src/components/sections/ContactSection.tsx` (variable `recipientEmail`). It's currently set to `konthamjaganmohanreddy@gmail.com`. Double-check this is your correct email.
3.  **Browser Pop-up Blockers/Extensions:** Some browser extensions or pop-up blockers might interfere with `mailto:` links, though this is uncommon.
4.  **Spam/Junk Folder:** Check your spam or junk mail folder in your `konthamjaganmohanreddy@gmail.com` account.
5.  **Toast Notifications:** The website provides toast notifications like "Opening Email Client..." or "Error Opening Email Client...". These can give clues about what the website attempted to do.

### Server-Side Errors Related to "MongoDB Configuration Error" or "Database Unavailable"

If you see error messages in your Next.js server console like:
`CRITICAL_MONGODB_CONFIG...` or `MongoDB Configuration Error...` or `Database Unavailable...`

These messages mean that:
1.  You have likely defined `MONGODB_URI` in your `.env.local` file (perhaps for future use or testing), but the value is incorrect, the placeholder, or your MongoDB server isn't reachable.
2.  Some part of the application (potentially old code, or code you're developing for other features) is trying to initialize or use a MongoDB connection.

**For the contact form itself, these MongoDB-related errors are not critical because it exclusively uses the `mailto:` link functionality and does not interact with the `/api/contact` route or MongoDB.**

However, if you *do* intend to use MongoDB for other parts of your application:
1.  **`.env.local` File**:
    *   Ensure the `.env.local` file exists in the root of your project.
    *   If `MONGODB_URI` is defined, verify that you have replaced `"YOUR_MONGODB_CONNECTION_STRING"` with your actual, valid MongoDB connection string.
    *   Confirm the scheme: it must start with `mongodb://` or `mongodb+srv://`.
2.  **MongoDB Server**:
    *   Ensure your MongoDB server (local instance or a cloud-hosted one like MongoDB Atlas) is running and accessible from your development machine or deployment environment.
    *   Check firewall rules if applicable.
    *   For MongoDB Atlas, ensure your current IP address is whitelisted for database access.
3.  **Restart Server**: After making any changes to `.env.local`, you **must** restart your Next.js development server (e.g., stop `npm run dev` and start it again).
4.  **Deployment Environment**: If you deploy this application and intend to use MongoDB features, double-check that `MONGODB_URI` (and `MONGODB_DB_NAME` if used) are correctly set as environment variables in your hosting provider's settings.
5.  **Server Logs**: Check the server-side console output of your Next.js application for more detailed error messages from the MongoDB driver. These logs can provide more specific clues about authentication failures, network issues, or parsing errors with the URI.
