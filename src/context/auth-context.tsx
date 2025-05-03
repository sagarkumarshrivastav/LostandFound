
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  type Auth,
} from 'firebase/auth';
import { app } from '@/lib/firebase'; // Import initialized Firebase app

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth: Auth = getAuth(app); // Get auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed, user:", currentUser?.email);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Memoize the context value to prevent unnecessary re-renders
   const value = useMemo(() => ({
      user,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
    }), [user, loading]); // Dependencies: user and loading state


  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after initial loading is complete */}
      {/* We can show a global loader here if needed, but for now, let components handle their loading state */}
      {children}
    </AuthContext.Provider>
  );
}
