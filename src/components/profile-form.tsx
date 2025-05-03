
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
import Image from 'next/image';

// Schema for profile updates including address
const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }).max(50, { message: "Display name cannot exceed 50 characters." }).optional(),
  email: z.string().email().optional(), // Email is usually read-only here
  address: z.object({
      street: z.string().max(100).optional(),
      city: z.string().max(50).optional(),
      state: z.string().max(50).optional(),
      zip: z.string().max(10).optional(), // Adjust max length as needed
      country: z.string().max(50).optional(),
  }).optional(),
  photoFile: z.instanceof(File).optional(), // For file upload
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
  defaultValues: Partial<ProfileFormValues & { address?: Record<string, string | undefined> }>; // Include address in defaults
  isSubmitting?: boolean;
}

export function ProfileForm({ onSubmit, defaultValues, isSubmitting = false }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: defaultValues.displayName || '',
      email: defaultValues.email || '',
      address: { // Initialize address fields from defaults
          street: defaultValues.address?.street || '',
          city: defaultValues.address?.city || '',
          state: defaultValues.address?.state || '',
          zip: defaultValues.address?.zip || '',
          country: defaultValues.address?.country || '',
      },
      photoFile: undefined, // Start with no file selected
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

   // Helper function to get initials
   const getInitials = (name?: string | null) => {
     if (!name) return '??';
     return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
   };

  return (
    <Form {...form}>
      {/* We pass form data directly, no need for <form> wrapping the FormProvider content */}
      {/* onSubmit is handled by the parent component */}
       <div className="space-y-6">
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
                Email associated with the account (cannot be changed here).
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Fields */}
         <fieldset className="space-y-4 rounded-md border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Address (Optional)</legend>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                            <Input placeholder="123 Main St" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Anytown" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                            <Input placeholder="CA" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Zip / Postal Code</FormLabel>
                        <FormControl>
                            <Input placeholder="90210" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
             </div>
             <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input placeholder="United States" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
         </fieldset>


         {/* Profile Picture Upload */}
        <FormField
          control={form.control}
          name="photoFile"
          render={({ field }) => ( // field is not directly used for input type file, but needed for hook form state
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
                       onChange={handleImageChange} // Use custom handler
                       disabled={isSubmitting}
                       // {...field} // Don't spread field directly for file input
                     />
                   </Button>
                    {/* Display preview or current avatar */}
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border shadow-sm">
                     {previewUrl ? (
                         <Image src={previewUrl} alt="New profile preview" layout="fill" objectFit="cover" />
                     ) : (
                         <Avatar className="h-full w-full">
                           <AvatarImage src={(defaultValues as any).photoURL || undefined} alt={defaultValues.displayName || 'Current Avatar'} />
                           <AvatarFallback>{getInitials(defaultValues.displayName)}</AvatarFallback>
                         </Avatar>
                     )}
                    </div>
                 </div>
               </FormControl>
              <FormDescription>
                 Upload a new profile picture (JPG, PNG, GIF). Max 10MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
           type="button" // Change type to button, onSubmit is handled by the parent page
           onClick={form.handleSubmit(onSubmit)} // Trigger form validation and onSubmit prop
           disabled={isSubmitting || !form.formState.isDirty} // Disable if submitting or no changes made
           className="w-full md:w-auto float-right bg-primary hover:bg-primary/90"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        </div>
    </Form>
  );
}
