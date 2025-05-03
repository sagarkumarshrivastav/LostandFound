 .# Lost & Found Application

This is a Next.js application designed to help users report and find lost or found items within a community. It features user authentication, item reporting, search/filtering, and user messaging.

## Features

-   **Authentication:** Email/Password signup & login, Google OAuth login (via Firebase).
-   **User Dashboard:** View and manage personal item reports and messages.
-   **Item Reporting:** Submit details about lost or found items (title, description, location, date, image).
-   **Item Browsing & Search:** View all reported items with filtering and search capabilities.
-   **Messaging:** Communicate with other users regarding specific items (future implementation with Socket.IO).
-   **Dark Mode:** Toggle between light and dark themes.
-   **Responsive Design:** Adapts to various screen sizes (desktop, tablet, mobile).
-   **Profile Management:** Update display name and profile picture.

## Tech Stack

-   **Framework:** Next.js (with App Router)
-   **Styling:** Tailwind CSS, ShadCN UI
-   **Authentication:** Firebase Authentication
-   **Database:** MongoDB (local instance during development)
-   **State Management:** React Context API (for Auth), React Hook Form (for forms)
-   **Animations:** Framer Motion
-   **(Planned) Real-time:** Socket.IO for messaging

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or accessible)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    *   Create a `.env` file in the root of the project.
    *   Copy the contents of `.env.example` (if provided) or use the structure below.
    *   **Firebase:**
        *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
        *   Add a Web App to your project.
        *   Go to Project settings > General > Your apps > Web app.
        *   Find your Firebase configuration keys (apiKey, authDomain, projectId, etc.).
        *   Add these keys to your `.env` file:
            ```env
            NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN.firebaseapp.com
            NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
            NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # Optional
            ```
        *   Enable **Email/Password** and **Google** sign-in methods in Firebase Authentication > Sign-in method.
    *   **MongoDB:**
        *   Ensure your MongoDB server is running (usually `mongod` command).
        *   Update the `MONGODB_URI` in your `.env` file to point to your local instance:
            ```env
            MONGODB_URI=mongodb://localhost:27017/lostandfound
            ```
    *   **(Optional) Genkit AI Key:**
        *   If using AI features, get an API key from Google Cloud Console.
            ```env
            GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_GENAI_API_KEY
            ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This command uses Turbopack for faster development builds and runs the app on `http://localhost:9002` by default (check `package.json` for the exact port).

5.  **Open the application:**
    Navigate to `http://localhost:9002` (or the specified port) in your web browser.

## Available Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Creates a production build of the application.
-   `npm run start`: Starts the production server (requires `npm run build` first).
-   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `npm run typecheck`: Runs TypeScript type checking.
-   `npm run genkit:dev`: Starts the Genkit development server (if using Genkit AI features).
-   `npm run genkit:watch`: Starts the Genkit development server with watch mode.

## Project Structure (Simplified)

```
.
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   │   ├── (pages)/    # Route groups
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── dashboard/
│   │   │   ├── items/
│   │   │   ├── profile/
│   │   │   ├── policy/
│   │   │   └── terms/
│   │   ├── api/        # API routes (if needed)
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   ├── components/     # Reusable UI components
│   │   ├── auth/
│   │   ├── ui/         # ShadCN UI components
│   │   ├── ...
│   ├── context/        # React context providers (e.g., AuthContext)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions, Firebase setup
│   ├── services/       # Service integrations (e.g., location)
│   ├── types/          # TypeScript type definitions
│   └── ai/             # Genkit AI related code (flows, prompts)
├── .env                # Environment variables (!!! NOT committed to git)
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Contributing

Contributions are welcome! Please follow standard coding practices and ensure your code passes linting and type checking.
```