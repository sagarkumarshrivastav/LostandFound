
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's recommended to use environment variables for configuration

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const isClientSide = typeof window !== 'undefined';

// Add a check for the API key ONLY on the client-side or if explicitly passed
if (isClientSide && !apiKey) {
  console.error(
    "Firebase Error: API Key is missing. Ensure the NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set correctly in your .env.local file or environment."
  );
   // Throw an error on the client if the key is missing, as Firebase is likely essential
   throw new Error("Firebase API Key is missing. Cannot initialize Firebase on the client.");
} else if (!isClientSide && !apiKey) {
  console.warn(
    "Firebase Warning: API Key is missing on the server-side. This might be expected if Firebase is only initialized on the client. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly configured if server-side initialization is needed."
  );
}


const firebaseConfig = {
  apiKey: apiKey, // Use the checked variable (can be undefined on server if not needed)
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase - Memoize the app instance
let app: FirebaseApp | null = null;

function getFirebaseApp() {
  if (app) {
    return app;
  }

  if (!getApps().length) {
    try {
      // Only initialize if we have an API key (relevant for client-side)
      // Server-side might proceed without API key if only using Firestore/Auth with emulator or specific server config
      if (apiKey || !isClientSide) {
         app = initializeApp(firebaseConfig);
         console.log("Firebase initialized successfully.");
      } else if (isClientSide) {
        // This case should be prevented by the earlier throw, but as a safeguard:
        console.error("Firebase Error: Attempting to initialize on client without API key.");
        return null; // Prevent initialization without key on client
      }

    } catch (error) {
       console.error("Firebase initialization error:", error);
       // Handle initialization error appropriately
       app = null;
    }
  } else {
    app = getApp();
     console.log("Firebase app instance reused.");
  }
  return app;
}


// Lazy initialization for services
let authInstance: ReturnType<typeof getAuth> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

function getFirebaseAuth() {
  if (authInstance) return authInstance;
  const currentApp = getFirebaseApp();
  if (currentApp) {
    authInstance = getAuth(currentApp);
  }
  return authInstance;
}

function getFirebaseDb() {
  if (dbInstance) return dbInstance;
  const currentApp = getFirebaseApp();
  if (currentApp) {
    dbInstance = getFirestore(currentApp);
  }
  return dbInstance;
}

function getFirebaseAnalytics() {
  if (analyticsInstance) return analyticsInstance;
  if (isClientSide) {
    const currentApp = getFirebaseApp();
    if (currentApp) {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analyticsInstance = getAnalytics(currentApp);
          } catch (error) {
            console.error("Firebase Analytics initialization error:", error);
          }
        }
      });
    }
  }
  return analyticsInstance;
}


// Export functions to get instances, promoting lazy initialization
export { getFirebaseApp, getFirebaseAuth, getFirebaseDb, getFirebaseAnalytics };

// Also export the config if needed elsewhere, but be cautious with API key exposure
// export { firebaseConfig };
