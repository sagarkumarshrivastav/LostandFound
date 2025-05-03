
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileForm, type ProfileFormValues } from '@/components/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';

export default function ProfilePage() {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home if not logged in
    }
  }, [user, loading, router]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
      return;
    }

    setIsSubmitting(true);
    try {
        // For now, we only update displayName. Image update requires storage setup.
        const updates: Partial<Pick<User, 'displayName' | 'photoURL'>> = {};
        if (values.displayName && values.displayName !== user.displayName) {
            updates.displayName = values.displayName;
        }
        // Placeholder for photoURL update logic if implemented
        // if (values.photoFile) {
        //   // 1. Upload file to storage (e.g., Firebase Storage) -> get URL
        //   // const photoURL = await uploadProfilePicture(values.photoFile, user.uid);
        //   // updates.photoURL = photoURL;
        //   console.warn("Profile picture upload not implemented yet.");
        // } else if (values.photoURL && values.photoURL !== user.photoURL) {
        //    // Or maybe allow direct URL input? Less common for profile pics.
        //    updates.photoURL = values.photoURL;
        // }


        if (Object.keys(updates).length > 0) {
            await updateUserProfile(updates);
            toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
        } else {
            toast({ title: 'No Changes', description: 'No changes were detected in your profile information.' });
        }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
      if (name) {
          return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      }
      if (email) {
          return email.substring(0, 2).toUpperCase();
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
            <div className="space-y-6 mt-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-20 w-full" /> {/* Placeholder for address/bio if added */}
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
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
               <AvatarFallback className="text-3xl bg-primary/20 text-primary font-semibold">
                {getInitials(user.displayName, user.email)}
              </AvatarFallback>
           </Avatar>
          <div className="text-center">
             <CardTitle className="text-2xl">{user.displayName || 'User'}</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
          </div>

        </CardHeader>
        <CardContent className="p-6">
          <ProfileForm
            onSubmit={handleProfileUpdate}
            defaultValues={{
              displayName: user.displayName || '',
              email: user.email || '', // Email is typically not editable here
              // photoURL: user.photoURL || '', // Pass existing URL if needed, but upload is separate
            }}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
