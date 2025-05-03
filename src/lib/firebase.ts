
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's recommended to use environment variables for configuration

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const isClientSide = typeof window !== 'undefined';

// Log the values being used (Be careful in production with sensitive keys)
if (isClientSide) {
    console.log("Firebase Config Check (Client-side):");
    console.log("API Key Provided:", !!apiKey);
    console.log("Auth Domain Provided:", !!authDomain);
    console.log("Project ID Provided:", !!projectId);
}

// Add a check for the API key ONLY on the client-side or if explicitly passed
if (isClientSide && !apiKey) {
  console.error(
    "Firebase Critical Error: API Key is missing. Ensure the NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set correctly in your .env.local file or environment and is accessible on the client."
  );
   // Throw an error on the client if the key is missing, as Firebase is likely essential
   throw new Error("Firebase API Key is missing. Cannot initialize Firebase on the client.");
} else if (!isClientSide && !apiKey) {
  console.warn(
    "Firebase Warning: API Key is missing on the server-side. This might be expected if Firebase is only initialized on the client. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly configured if server-side initialization is needed."
  );
}
// Add similar checks for other critical config values if needed (e.g., authDomain, projectId)
if (isClientSide && !authDomain) {
    console.warn("Firebase Config Warning: Auth Domain is missing (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).");
}
if (isClientSide && !projectId) {
    console.warn("Firebase Config Warning: Project ID is missing (NEXT_PUBLIC_FIREBASE_PROJECT_ID).");
}


const firebaseConfig = {
  apiKey: apiKey, // Use the checked variable (can be undefined on server if not needed)
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase - Memoize the app instance
let app: FirebaseApp | null = null;

function getFirebaseApp() {
  if (app) {
    // console.log("Returning memoized Firebase app instance.");
    return app;
  }

  console.log("Attempting to get/initialize Firebase app...");
  if (!getApps().length) {
    console.log("No Firebase apps initialized yet. Initializing new app...");
    try {
      // Only initialize if we have an API key (relevant for client-side)
      // Server-side might proceed without API key if only using Firestore/Auth with emulator or specific server config
      if (apiKey || !isClientSide) {
         app = initializeApp(firebaseConfig);
         console.log("Firebase initialized successfully.");
      } else if (isClientSide) {
        // This case should be prevented by the earlier throw, but as a safeguard:
        console.error("Firebase Error: Attempting to initialize on client without API key. Initialization aborted.");
        return null; // Prevent initialization without key on client
      } else {
          console.log("Firebase: Not initializing on server without API key (this might be intended).");
          return null;
      }

    } catch (error) {
       console.error("Firebase initialization error:", error);
       // Handle initialization error appropriately
       app = null;
       return null; // Return null if initialization fails
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
  console.log("Attempting to get Firebase Auth instance...");
  const currentApp = getFirebaseApp();
  if (currentApp) {
    try {
        authInstance = getAuth(currentApp);
        console.log("Firebase Auth instance obtained.");
    } catch (error) {
        console.error("Error getting Firebase Auth instance:", error);
        authInstance = null;
    }
  } else {
      console.error("Cannot get Firebase Auth because Firebase App is not available.");
      authInstance = null;
  }
  return authInstance;
}

function getFirebaseDb() {
  if (dbInstance) return dbInstance;
   console.log("Attempting to get Firestore instance...");
  const currentApp = getFirebaseApp();
  if (currentApp) {
     try {
        dbInstance = getFirestore(currentApp);
        console.log("Firestore instance obtained.");
     } catch (error) {
        console.error("Error getting Firestore instance:", error);
        dbInstance = null;
     }
  } else {
      console.error("Cannot get Firestore because Firebase App is not available.");
      dbInstance = null;
  }
  return dbInstance;
}

function getFirebaseAnalytics() {
  if (analyticsInstance) return analyticsInstance;
  if (isClientSide) {
     console.log("Attempting to get Firebase Analytics instance...");
    const currentApp = getFirebaseApp();
    if (currentApp) {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analyticsInstance = getAnalytics(currentApp);
             console.log("Firebase Analytics instance obtained.");
          } catch (error) {
            console.error("Firebase Analytics initialization error:", error);
            analyticsInstance = null;
          }
        } else {
            console.log("Firebase Analytics is not supported in this environment.");
            analyticsInstance = null;
        }
      }).catch(error => {
           console.error("Error checking Firebase Analytics support:", error);
            analyticsInstance = null;
      });
    } else {
        console.error("Cannot get Firebase Analytics because Firebase App is not available.");
        analyticsInstance = null;
    }
  } else {
      console.log("Firebase Analytics not initialized on server-side.");
  }
  return analyticsInstance;
}


// Export functions to get instances, promoting lazy initialization
export { getFirebaseApp, getFirebaseAuth, getFirebaseDb, getFirebaseAnalytics };

// Also export the config if needed elsewhere, but be cautious with API key exposure
// export { firebaseConfig };
