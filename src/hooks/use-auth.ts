
"use client";

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import type { User } from 'firebase/auth';

// Extend the context type to include the new update function
interface ExtendedAuthContextType extends ReturnType<typeof useAuthBase> {
    updateUserProfile: (updates: Partial<Pick<User, 'displayName' | 'photoURL'>>) => Promise<void>;
}


// Base hook implementation (internal)
const useAuthBase = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Exported hook combining base and update function
export const useAuth = (): ExtendedAuthContextType => {
    const baseAuth = useAuthBase();

    // Function to update user profile in Firebase Auth
    const updateUserProfile = async (updates: Partial<Pick<User, 'displayName' | 'photoURL'>>) => {
        if (!baseAuth.authInstance || !baseAuth.user) {
            throw new Error("Auth instance or user not available for profile update.");
        }
        if (Object.keys(updates).length === 0) {
            console.log("No profile updates provided.");
            return; // No need to call Firebase if nothing changed
        }
        try {
             // Firebase's updateProfile only accepts specific fields
            const authUpdates: { displayName?: string | null; photoURL?: string | null } = {};
            if (updates.displayName !== undefined) {
                authUpdates.displayName = updates.displayName;
            }
             if (updates.photoURL !== undefined) {
                authUpdates.photoURL = updates.photoURL;
             }

            // Import dynamically only when needed
             const { updateProfile } = await import("firebase/auth");
             await updateProfile(baseAuth.user, authUpdates);
            // Note: This updates Firebase Auth profile, but not necessarily Firestore user doc if you have one.
             console.log("Firebase Auth profile updated successfully.");
             // Optionally: Trigger a state refresh or refetch user data if needed
             // e.g., baseAuth.refreshUserData(); // Implement this in AuthProvider if required
        } catch (error) {
            console.error("Error updating Firebase Auth profile:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    };

    return {
        ...baseAuth,
        updateUserProfile,
    };
};

// Keep the original hook export if needed elsewhere, but prefer the extended one
// export const useAuth = useAuthBase;
