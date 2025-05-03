
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
import { Github, Chrome, Loader2 } from "lucide-react"; // Using Chrome icon for Google, added Loader2

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void; // Callback on successful auth
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const schema = mode === 'login' ? loginSchema : signupSchema;
  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === 'signup' && { confirmPassword: "" }),
    },
  });

  const onSubmit = async (values: LoginFormValues | SignupFormValues) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
        toast({ title: "Login Successful", description: "Welcome back!" });
      } else {
        await signup(values.email, (values as SignupFormValues).password);
        toast({ title: "Signup Successful", description: "Welcome to FindIt Local!" });
      }
      onSuccess?.(); // Call success callback if provided
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      toast({
        variant: "destructive",
        title: `${mode === 'login' ? 'Login' : 'Signup'} Failed`,
        description: error.message || `Could not ${mode}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      try {
          await loginWithGoogle();
          toast({ title: "Login Successful", description: "Welcome!" });
          onSuccess?.();
      } catch (error: any) {
          console.error("Google login error:", error);
          toast({
              variant: "destructive",
              title: "Google Login Failed",
              description: error.message || "Could not log in with Google. Please try again.",
          });
      } finally {
          setIsGoogleLoading(false);
      }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading || isGoogleLoading} />
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
          disabled={isLoading || isGoogleLoading}
          className="w-full"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" /> // Using Chrome for Google
          )}
          {isGoogleLoading ? 'Processing...' : 'Google'}
        </Button>
      </form>
    </Form>
  );
}
