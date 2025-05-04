
import type { User } from './user'; // Import the frontend User type

export type ItemType = 'lost' | 'found';

export interface Item {
  _id: string; // MongoDB ID
  user: User | string; // Can be populated User object or just user ID string initially
  type: ItemType;
  title: string;
  description: string;
  imageUrl?: string; // Optional image URL (from Cloudinary)
  imagePublicId?: string; // Cloudinary public ID
  location: string;
  dateLostOrFound: string; // Date string (ISO format) - Changed from Date to string
  createdAt: string; // Date string (ISO format) - Changed from Date to string
  // Optional coordinate fields if using GeoJSON later
  // lat?: number;
  // lng?: number;
}

// Interface for paginated item responses from the API
export interface PaginatedItemsResponse {
    items: Item[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}
