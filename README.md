# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project requires certain environment variables to be set for full functionality, especially for database connections and GenAI features.

Create a `.env.local` file in the root of your project and add the following variables, replacing the placeholder values with your actual credentials:

```env
# MongoDB Configuration
MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
MONGODB_DB_NAME="portfolio_jmr" # Or your preferred database name

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

# Google Generative AI API Key (if using Genkit with Google AI models)
# GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"
```

**Important:**
- Replace `"YOUR_MONGODB_CONNECTION_STRING"` with your actual MongoDB connection string. You can get this from your MongoDB Atlas dashboard or your self-hosted MongoDB instance.
- The `MONGODB_DB_NAME` defaults to `portfolio_jmr` but can be changed.
- Fill in the Firebase and Gmail credentials only if you are implementing features that require them.
- The `GOOGLE_GENAI_API_KEY` is needed if you intend to use Genkit with Google AI models.
- **Never commit your `.env.local` file to a public repository.** It is included in `.gitignore` by default.

To run the application locally after setting up your `.env.local` file:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

If you are deploying this application, ensure these environment variables are configured in your deployment environment's settings.
