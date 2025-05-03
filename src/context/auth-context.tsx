
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
  const [loading, setLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);

  // Initialize auth instance on mount
  useEffect(() => {
    const instance = getFirebaseAuth();
    setAuthInstance(instance);
  }, []);

  useEffect(() => {
    if (!authInstance) {
      setLoading(false); // If auth instance couldn't be created, stop loading
      console.error("Auth instance is not available.");
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed, user:", currentUser?.email);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [authInstance]); // Rerun effect if authInstance changes

  const login = (email: string, pass: string) => {
    if (!authInstance) return Promise.reject(new Error("Auth not initialized"));
    return signInWithEmailAndPassword(authInstance, email, pass);
  };

  const signup = (email: string, pass: string) => {
     if (!authInstance) return Promise.reject(new Error("Auth not initialized"));
    return createUserWithEmailAndPassword(authInstance, email, pass);
  };

  const logout = () => {
     if (!authInstance) return Promise.reject(new Error("Auth not initialized"));
    return signOut(authInstance);
  };

  const loginWithGoogle = () => {
     if (!authInstance) return Promise.reject(new Error("Auth not initialized"));
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
      {/* Render children only after initial loading is complete */}
      {/* We can show a global loader here if needed, but for now, let components handle their loading state */}
      {children}
    </AuthContext.Provider>
  );
}
