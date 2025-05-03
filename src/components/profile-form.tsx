
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, type ChangeEvent } from "react";
import Image from 'next/image'; // Use next/image for optimized images

// Schema for profile updates
const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }).max(50, { message: "Display name cannot exceed 50 characters." }).optional(),
  email: z.string().email().optional(), // Email is usually read-only here
  photoFile: z.instanceof(File).optional(), // For file upload
  // photoURL: z.string().url().optional(), // Alternative: Allow entering a URL (less common)
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
  defaultValues: Partial<ProfileFormValues>;
  isSubmitting?: boolean;
}

export function ProfileForm({ onSubmit, defaultValues, isSubmitting = false }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: defaultValues.displayName || '',
      email: defaultValues.email || '',
      // photoURL: defaultValues.photoURL || '',
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Preview for uploaded image

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("photoFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("photoFile", undefined);
      setPreviewUrl(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Email (Readonly) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} readOnly disabled className="cursor-not-allowed bg-muted/50" />
              </FormControl>
               <FormDescription>
                Email cannot be changed here. Contact support if needed.
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         {/* Profile Picture Upload */}
        <FormField
          control={form.control}
          name="photoFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture (Optional)</FormLabel>
               <FormControl>
                 <div className="flex items-center gap-4">
                   <Button type="button" variant="outline" className="relative" disabled={isSubmitting}>
                     <Upload className="mr-2 h-4 w-4" />
                     {previewUrl ? "Change Image" : "Upload Image"}
                     <Input
                       type="file"
                       accept="image/png, image/jpeg, image/gif" // Accept common image types
                       className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                       onChange={handleImageChange}
                       disabled={isSubmitting}
                     />
                   </Button>
                   {previewUrl && (
                     <div className="relative h-16 w-16 overflow-hidden rounded-full border shadow-sm">
                        <Image src={previewUrl} alt="New profile preview" layout="fill" objectFit="cover" />
                     </div>
                   )}
                    {!previewUrl && defaultValues.displayName && ( // Show current avatar if no preview
                        <Avatar className="h-16 w-16 border">
                          <AvatarImage src={(defaultValues as any).photoURL || undefined} alt={defaultValues.displayName || 'Current Avatar'} />
                          <AvatarFallback>{defaultValues.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                 </div>
               </FormControl>
              <FormDescription>
                Upload a new profile picture (JPG, PNG, GIF). Note: Actual upload requires backend/storage setup.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto float-right bg-primary hover:bg-primary/90">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
