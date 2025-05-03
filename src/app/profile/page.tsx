
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileForm, type ProfileFormValues } from '@/components/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types/user'; // Import frontend User type

export default function ProfilePage() {
  const { user, loading, updateUserProfile, token } = useAuth(); // Use updateUserProfile from context
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user || !token) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
      return;
    }

    setIsSubmitting(true);

     // Use FormData to handle file uploads and other fields
    const formData = new FormData();
    if (values.displayName && values.displayName !== user.displayName) {
        formData.append('displayName', values.displayName);
    }
    if (values.address) {
        if (values.address.street) formData.append('street', values.address.street);
        if (values.address.city) formData.append('city', values.address.city);
        if (values.address.state) formData.append('state', values.address.state);
        if (values.address.zip) formData.append('zip', values.address.zip);
        if (values.address.country) formData.append('country', values.address.country);
    }
    if (values.photoFile) {
        formData.append('photo', values.photoFile); // Use 'photo' as the key expected by backend (upload.single('photo'))
    }

    // Check if any data is actually being sent
    let hasDataToSend = false;
    for (const _ of formData.entries()) {
        hasDataToSend = true;
        break;
    }

    if (!hasDataToSend) {
        toast({ title: 'No Changes', description: 'No changes were detected in your profile information.' });
        setIsSubmitting(false);
        return;
    }


    try {
        await updateUserProfile(formData); // Call context function
        toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
        // User state in context is updated automatically by updateUserProfile function
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.response?.data?.msg || error.message || 'Could not update profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   // Function to get initials for Avatar fallback
   const getInitials = (displayName?: string | null, email?: string | null) => {
     if (displayName) {
       return displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
     }
     if (email) {
        const namePart = email.split('@')[0];
        if (namePart.includes('.')) {
            return namePart.split('.').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
       return namePart.substring(0, 2).toUpperCase();
     }
     return '??';
   };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="items-center text-center">
             <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
             <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
             {/* Skeleton for the form */}
            <div className="space-y-6 mt-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-20 w-full" /> {/* Placeholder for address */}
                 <Skeleton className="h-10 w-full" /> {/* Placeholder for image upload */}
                 <Skeleton className="h-10 w-1/3 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // Should be redirected, but return null as fallback
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">My Profile</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center space-y-4 pb-6 bg-gradient-to-br from-primary/10 to-background rounded-t-lg">
           <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
             {/* Display user's photoURL */}
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
               {/* Fallback initials */}
               <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                {getInitials(user.displayName, user.email)}
              </AvatarFallback>
           </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl">{user.displayName || 'User'}</CardTitle>
             {/* Display email or phone */}
            <CardDescription className="text-base">{user.email || user.phoneNumber}</CardDescription>
          </div>

        </CardHeader>
        <CardContent className="p-6">
           {/* Pass default values from the current user state */}
          <ProfileForm
            onSubmit={handleProfileUpdate}
            defaultValues={{
              displayName: user.displayName || '',
              email: user.email || '', // Email might not be editable depending on backend
              address: user.address || {}, // Pass existing address
              // photoURL is handled via display, not direct input
            }}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
