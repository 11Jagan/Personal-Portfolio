
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project's contact form stores submitted messages in a local JSON file (`data/messages.json`). No external database configuration (like MongoDB) is required for the contact form to function in a local development environment.

Create a `.env.local` file in the root of your project if you plan to use Genkit or Firebase features beyond the contact form.

```env
# Google Generative AI API Key (if using Genkit with Google AI models)
# GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"

# Firebase Configuration (if using Firebase features)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
# NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

**Important Notes for Contact Form & `.env.local`:**
-   **Contact Form:** The contact form submits data to the `/api/contact` backend endpoint, which saves messages to a local `data/messages.json` file.
    -   **This local file storage is intended for development and demonstration purposes ONLY.** It is NOT suitable for production environments due to potential data loss on deployment and lack of scalability.
    -   You can find submitted messages by opening the `data/messages.json` file in your project.
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

If you are deploying this application, you will need to implement a proper persistent storage solution (e.g., a cloud database like MongoDB Atlas, Firebase Firestore, etc.) for the contact form messages. The current local file storage will not work reliably in most hosting environments.

## Troubleshooting

### Contact Form Submissions

-   **Messages Location:** Messages submitted through the contact form are saved to a file named `messages.json` inside a `data` directory in the root of your project (i.e., `data/messages.json`).
-   **Server Errors:**
    -   If the contact form shows an error like "Failed to save message locally," check the terminal where your Next.js development server (`npm run dev`) is running.
    -   Look for error messages related to file system operations (e.g., permissions issues, problems creating the `data` directory or `messages.json` file).
    -   Ensure your project has write permissions in its root directory so it can create the `data` folder and `messages.json` file.
-   **Toast Notifications:**
    -   The website provides toast notifications upon form submission (e.g., "Message Sent!", "Submission Error"). These give clues about the outcome.

### Mailto Links (Direct Contact Methods)

The "Contact Details" card and the footer still contain direct `mailto:` links (e.g., for the email icon). These will open the visitor's default email application and are independent of the main contact form's local file storage.
