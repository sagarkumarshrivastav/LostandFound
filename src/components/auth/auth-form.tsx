
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Chrome, Loader2 } from "lucide-react"; // Using Chrome icon for Google

// Combined Schema for Login/Signup - adjust based on your exact needs
const authSchema = z.object({
  // Identifier can be email or phone
  identifier: z.string().min(3, { message: "Email or Phone Number is required."}),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  displayName: z.string().optional(), // Optional for signup
  confirmPassword: z.string().optional(), // Optional for signup
}).refine((data) => {
    // Require confirmPassword only in signup mode
    if (data.displayName !== undefined) { // Assuming displayName presence indicates signup
        return data.password === data.confirmPassword;
    }
    return true; // Skip validation if not in signup mode
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

// Refine further to check if identifier is email or phone (optional, but good practice)
// .refine(...)

type AuthFormValues = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void; // Callback on successful auth
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      identifier: "",
      password: "",
      displayName: mode === 'signup' ? "" : undefined, // Only set for signup
      confirmPassword: mode === 'signup' ? "" : undefined, // Only set for signup
    },
     mode: "onChange", // Validate on change for better UX
  });

   const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
   // Basic phone number check (adjust regex as needed for your expected format)
   const isPhone = (value: string) => /^\+?[0-9\s\-()]{7,}$/.test(value);


  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
       const isIdentifierEmail = isEmail(values.identifier);
       const isIdentifierPhone = isPhone(values.identifier);

      if (mode === 'login') {
          if (!isIdentifierEmail && !isIdentifierPhone) {
              form.setError("identifier", { type: "manual", message: "Please enter a valid email or phone number." });
              setIsLoading(false);
              return;
          }
          const loginCredentials = {
              ...(isIdentifierEmail && { email: values.identifier }),
              ...(isIdentifierPhone && { phoneNumber: values.identifier }),
              password: values.password,
          };
          await login(loginCredentials);
          toast({ title: "Login Successful", description: "Welcome back!" });
      } else { // Signup mode
         if (!isIdentifierEmail && !isIdentifierPhone) {
            form.setError("identifier", { type: "manual", message: "Please enter a valid email or phone number for signup." });
             setIsLoading(false);
             return;
         }
          const signupData = {
              displayName: values.displayName || values.identifier.split('@')[0] || 'User', // Default display name
              ...(isIdentifierEmail && { email: values.identifier }),
              ...(isIdentifierPhone && { phoneNumber: values.identifier }),
              password: values.password,
          };
          await signup(signupData);
          toast({ title: "Signup Successful", description: "Welcome to Lost & Found!" });
      }
      onSuccess?.(); // Call success callback if provided
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      toast({
        variant: "destructive",
        title: `${mode === 'login' ? 'Login' : 'Signup'} Failed`,
        description: error.response?.data?.msg || error.message || `Could not ${mode}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      try {
          // Redirects to backend, no direct await needed here
          loginWithGoogle();
          // Success is handled by the /auth/callback page
      } catch (error: any) { // Catch potential synchronous errors if any
          console.error("Google login initiation error:", error);
          toast({
              variant: "destructive",
              title: "Google Login Failed",
              description: error.message || "Could not start Google login process.",
          });
           setIsGoogleLoading(false); // Stop loading on immediate error
      }
      // No finally block needed to set loading false here, as redirect happens
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} disabled={isLoading || isGoogleLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mode === 'login' ? 'Email or Phone Number' : 'Email or Phone Number'}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={mode === 'login' ? "you@example.com or +1234567890" : "Enter email or phone"} {...field} disabled={isLoading || isGoogleLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isGoogleLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isGoogleLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
        </Button>

         <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading} // Disable if local auth is processing too
          className="w-full"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" /> // Using Chrome for Google
          )}
          {isGoogleLoading ? 'Redirecting...' : 'Google'}
        </Button>
      </form>
    </Form>
  );
}
