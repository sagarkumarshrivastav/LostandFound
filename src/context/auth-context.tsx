
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios'; // Use axios for API calls
import type { User } from '@/types/user'; // Define a User type for frontend

// Define the API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email?: string; phoneNumber?: string; password: string }) => Promise<void>;
  signup: (userData: { displayName?: string; email?: string; phoneNumber?: string; password: string }) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void; // Redirects to backend Google auth route
  updateUserProfile: (formData: FormData) => Promise<User>; // Use FormData for file uploads
  loadUser: () => Promise<void>; // Function to load user data using token
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to set token in Axios headers and local storage
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
    // console.log("Auth Token Set:", token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
    // console.log("Auth Token Removed");
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until user state is confirmed


  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) { // Only load if token exists and user isn't already set
      console.log("AuthProvider: Found token in storage, attempting to load user...");
      setAuthToken(storedToken); // Set token for the upcoming API call
      setToken(storedToken);
      try {
        const res = await axios.get<User>(`${API_URL}/auth/me`);
        console.log("AuthProvider: User loaded successfully:", res.data);
        setUser(res.data);
      } catch (err: any) {
        console.error("AuthProvider: Error loading user:", err.response?.data?.msg || err.message);
        setAuthToken(null); // Remove invalid token
        setToken(null);
        setUser(null);
      } finally {
         // Ensure loading is set to false even if user load fails but token existed initially
         if (loading) setLoading(false);
      }
    } else {
        console.log("AuthProvider: No token found or user already loaded.");
        // No token found, stop loading
        if (loading) setLoading(false);
    }
  }, [loading, user]); // Depend on loading and user state

   // Load user on initial mount or when token might change externally
  useEffect(() => {
    console.log("AuthProvider: Initial mount effect - checking token/loading user.");
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount to check initial token

  const login = async (credentials: { email?: string; phoneNumber?: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post<{ token: string }>(`${API_URL}/auth/login`, credentials);
      setAuthToken(res.data.token);
      setToken(res.data.token);
      await loadUser(); // Load user data after successful login
    } catch (err: any) {
      console.error("Login error:", err.response?.data?.msg || err.message);
      setAuthToken(null); // Clear token on failure
      setToken(null);
      setUser(null);
       throw err; // Re-throw error to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: { displayName?: string; email?: string; phoneNumber?: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post<{ token: string }>(`${API_URL}/auth/signup`, userData);
      setAuthToken(res.data.token);
      setToken(res.data.token);
      await loadUser(); // Load user data after successful signup
    } catch (err: any) {
      console.error("Signup error:", err.response?.data?.msg || err.message);
      setAuthToken(null); // Clear token on failure
      setToken(null);
      setUser(null);
      throw err; // Re-throw error
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("AuthProvider: Logging out.");
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setLoading(false); // User is definitively logged out
     // Optionally redirect using router if needed here or in the component calling logout
  };

  // Redirects to backend route to initiate Google OAuth flow
  const loginWithGoogle = () => {
      // Construct the full backend URL
      const googleAuthUrl = `${API_URL}/auth/google`;
      console.log("AuthProvider: Redirecting to Google OAuth:", googleAuthUrl);
      window.location.href = googleAuthUrl; // Redirect the browser
  };

  // Function to update user profile using FormData
  const updateUserProfile = async (formData: FormData): Promise<User> => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      // Ensure the token is set in headers for this request
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token, // Explicitly set token here if axios defaults aren't reliable
        },
      };
      const res = await axios.put<User>(`${API_URL}/users/profile`, formData, config);
      setUser(res.data); // Update user state with the returned updated user
      return res.data; // Return updated user data
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data?.msg || err.message);
       throw err; // Re-throw error
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value
   const value = useMemo(() => ({
      user,
      token,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      updateUserProfile,
      loadUser // Expose loadUser
    }), [user, token, loading, loadUser, login, signup, logout, loginWithGoogle, updateUserProfile]); // Include all functions in dependencies

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
