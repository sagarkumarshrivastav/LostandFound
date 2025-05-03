
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's recommended to use environment variables for configuration

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Add a check for the API key
if (!apiKey) {
  console.error(
    "Firebase Error: API Key is missing. Ensure the NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set correctly in your .env.local file or environment."
  );
  // You might want to throw an error here if Firebase is absolutely critical
  // throw new Error("Firebase API Key is missing. Cannot initialize Firebase.");
}


const firebaseConfig = {
  apiKey: apiKey, // Use the checked variable
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
// Prevent multiple initializations in HMR scenarios
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
     console.error("Firebase initialization error:", error);
     // Handle initialization error appropriately, maybe set app to null or rethrow
     // For now, we'll let the subsequent getAuth/getFirestore potentially fail if app is undefined
     // This helps surface the root cause (e.g., invalid config)
     app = null as any; // Assign null and cast to any to satisfy type checker temporarily
  }

} else {
  app = getApp();
}

// Initialize other Firebase services safely, checking if app was initialized
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// Initialize Analytics if supported and app exists
let analytics;
if (typeof window !== 'undefined' && app) {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch(error) {
         console.error("Firebase Analytics initialization error:", error);
      }
    }
  });
}


export { app, auth, db, analytics };
