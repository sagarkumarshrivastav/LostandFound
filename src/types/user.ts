
// Frontend User type - Mirrors backend User model structure (excluding sensitive fields)
export interface User {
  _id: string; // MongoDB ID
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
  };
  photoURL?: string; // URL to profile picture
  googleId?: string; // Only present if linked/signed up with Google
  date: string; // Date string (ISO format)
}
