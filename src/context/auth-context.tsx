
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  type Auth,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase'; // Import function to get auth instance

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  authInstance: Auth | null; // Expose the auth instance
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until auth state is confirmed
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false); // Track if auth instance initialization attempt finished

  // Attempt to initialize auth instance on mount
  useEffect(() => {
    console.log("Attempting to initialize Firebase Auth instance...");
    const instance = getFirebaseAuth();
    if (instance) {
        console.log("Firebase Auth instance obtained successfully.");
        setAuthInstance(instance);
        setAuthInitialized(true); // Mark initialization as successful
    } else {
        console.error("Failed to get Firebase Auth instance from getFirebaseAuth(). Check Firebase config (API Key, etc.) and initialization logs in firebase.ts.");
        setAuthInitialized(true); // Mark attempt as complete, even if failed
        setLoading(false); // Stop loading if auth instance is definitively unavailable
    }
  }, []); // Run only once on mount

  // Set up the auth state listener once the instance is potentially available
  useEffect(() => {
    // Only proceed if the initialization attempt is complete
    if (!authInitialized) {
        console.log("Auth initialization not yet attempted, skipping listener setup.");
        return;
    }

    if (!authInstance) {
      // This confirms that the first effect failed to set a valid instance
      console.error("Auth instance is not available after initialization attempt. Cannot set up auth state listener. Check previous errors.");
      // Loading state should have been set to false in the first effect if instance was null
      return;
    }

    console.log("Auth instance available, setting up Firebase Auth listener...");
    // setLoading(true); // No need to set loading true here, it starts true

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state confirmed, stop loading
      console.log("Auth state changed, user:", currentUser?.email ?? 'logged out');
    }, (error) => {
        // Handle errors during listener setup/execution
        console.error("Error in onAuthStateChanged listener:", error);
        setUser(null); // Assume logged out on error
        setLoading(false); // Stop loading on error
    });

    // Cleanup subscription on unmount
    return () => {
        console.log("Cleaning up Firebase Auth listener.");
        unsubscribe();
    }
    // Rerun effect ONLY if authInstance changes (which shouldn't happen after initial setup)
    // Or if authInitialized becomes true AND authInstance is valid
  }, [authInstance, authInitialized]);

  const login = (email: string, pass: string) => {
    if (!authInstance) {
        console.error("Login failed: Auth not initialized");
        return Promise.reject(new Error("Auth not initialized"));
    }
    return signInWithEmailAndPassword(authInstance, email, pass);
  };

  const signup = (email: string, pass: string) => {
     if (!authInstance) {
        console.error("Signup failed: Auth not initialized");
        return Promise.reject(new Error("Auth not initialized"));
     }
    return createUserWithEmailAndPassword(authInstance, email, pass);
  };

  const logout = () => {
     if (!authInstance) {
        console.error("Logout failed: Auth not initialized");
        return Promise.reject(new Error("Auth not initialized"));
     }
    return signOut(authInstance);
  };

  const loginWithGoogle = () => {
     if (!authInstance) {
        console.error("Google login failed: Auth not initialized");
        return Promise.reject(new Error("Auth not initialized"));
     }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider);
  };

  // Memoize the context value to prevent unnecessary re-renders
   const value = useMemo(() => ({
      user,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      authInstance, // Provide authInstance
    }), [user, loading, authInstance]); // Dependencies: user, loading state, and authInstance


  return (
    <AuthContext.Provider value={value}>
      {/* Render children. Components should handle the loading state internally. */}
      {children}
    </AuthContext.Provider>
  );
}
