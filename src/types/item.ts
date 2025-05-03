
export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  imageUrl?: string; // Optional image URL
  location: string; // Simple text location for now
  date: Date; // Date lost or found
  lat?: number; // Optional latitude
  lng?: number; // Optional longitude
}
