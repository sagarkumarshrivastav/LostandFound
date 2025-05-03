
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { loadUser } = useAuth(); // Use loadUser from context
  const searchParams = useSearchParams(); // Use useSearchParams hook

   // Using state to track processing status
  // const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    // Extract token from URL fragment (#)
    const hash = window.location.hash.substring(1); // Remove the leading '#'
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    const error = searchParams?.get('error'); // Check query params for errors

    console.log("AuthCallbackPage: Hash:", hash);
    console.log("AuthCallbackPage: Token extracted:", token);
    console.log("AuthCallbackPage: Error from query params:", error);

    if (error) {
        console.error("OAuth Error:", error);
        // setStatus(`Authentication failed: ${error}. Redirecting...`);
        // Optionally show an error message to the user via toast
        alert(`Authentication failed: ${error}`); // Simple alert for now
        router.push('/login'); // Redirect to login page on error
    } else if (token) {
      // Store the token
      localStorage.setItem('token', token);
       // Reload user data using the new token
       loadUser().then(() => {
           // setStatus('Authentication successful! Redirecting to dashboard...');
           console.log("AuthCallbackPage: User loaded, redirecting to dashboard.");
           router.push('/dashboard'); // Redirect to dashboard on success
       }).catch(err => {
           console.error("AuthCallbackPage: Error loading user after callback:", err);
           // setStatus('Failed to load user data. Redirecting to login...');
           alert('Authentication succeeded, but failed to load user data. Please try logging in again.');
           localStorage.removeItem('token'); // Clean up token if user load failed
           router.push('/login');
       });

    } else {
      // No token found, redirect to login
       console.log("AuthCallbackPage: No token found in hash. Redirecting to login.");
      // setStatus('Invalid authentication callback. Redirecting...');
      router.push('/login');
    }
    // Disable exhaustive-deps because we only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, loadUser]); // Add searchParams to dependency array? Maybe not needed as it reads once.

  // Display a loading/processing message
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Processing authentication...</p>
      {/* <p className="mt-2 text-sm text-muted-foreground">{status}</p> */}
    </div>
  );
}
