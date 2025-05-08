
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project's contact form uses EmailJS to send messages directly from the client-side.

Create a `.env.local` file in the root of your project:

```env
# EmailJS Configuration (Required for Contact Form)
# NEXT_PUBLIC_EMAILJS_SERVICE_ID="YOUR_EMAILJS_SERVICE_ID"
# NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="YOUR_EMAILJS_TEMPLATE_ID"
# NEXT_PUBLIC_EMAILJS_USER_ID="YOUR_EMAILJS_USER_ID" # (Public Key)

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
-   **Contact Form:** The contact form uses [EmailJS](https://www.emailjs.com/) to send emails. You **MUST** create an EmailJS account, set up an email service (e.g., Gmail), and create an email template.
    -   Replace `YOUR_EMAILJS_SERVICE_ID`, `YOUR_EMAILJS_TEMPLATE_ID`, and `YOUR_EMAILJS_USER_ID` (this is your Public Key from EmailJS account settings) with your actual EmailJS credentials.
    -   The template you create in EmailJS should include variables that match the form fields (e.g., `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`). The `ContactSection.tsx` component sends these parameters.
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

If you are deploying this application, ensure your EmailJS account and templates are correctly configured for the production environment.

## Troubleshooting

### Contact Form Submissions

-   **EmailJS Configuration:**
    -   Ensure `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_USER_ID` are correctly set in your `.env.local` file and that you've restarted your development server.
    -   Verify your EmailJS service and template are set up correctly in your EmailJS dashboard. Check that the template variables match what `ContactSection.tsx` sends.
    -   Check your EmailJS account dashboard for any errors or usage limits.
-   **Console Errors:** Open your browser's developer console (usually F12) and check for any error messages when you submit the form.
-   **Toast Notifications:**
    -   The website provides toast notifications upon form submission (e.g., "Message Sent!", "Submission Error"). These give clues about the outcome.

### Mailto Links (Direct Contact Methods)

The "Contact Details" card and the footer still contain direct `mailto:` links (e.g., for the email icon). These will open the visitor's default email application and are independent of the EmailJS contact form.
