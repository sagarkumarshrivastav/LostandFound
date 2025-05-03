
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import type { Item, ItemType } from '@/types/item'; // Ensure ItemType is exported/imported if needed elsewhere
import { ItemList } from '@/components/item-list';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Import Card for Skeleton structure
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Import Pagination
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// --- Mock Data Fetching ---
// Replace this with actual API calls later
const fetchUserItems = async (userId: string): Promise<Item[]> => {
  console.log(`Fetching items for user: ${userId}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Filter mock data (replace with real fetch)
   const generateMockItems = (count: number): Item[] => {
      const items: Item[] = [];
      const types: ItemType[] = ['lost', 'found'];
      const titles = ["Keys", "Wallet", "Phone", "Backpack", "Laptop", "Book", "Glasses", "Watch", "Umbrella", "Jacket"];
      const locations = ["Park", "Cafe", "Bus Stop", "Library", "Train Station", "Supermarket", "Office Building", "University Campus", "Restaurant", "Shopping Mall"];
      const descriptions = [
        "Found near the main entrance.",
        "Lost on the number 12 bus.",
        "Black leather wallet with ID.",
        "iPhone 13, blue case.",
        "Contains important documents.",
        "Hardcover novel, slightly worn.",
        "Prescription glasses, black frame.",
        "Silver wristwatch, needs repair.",
        "Large black umbrella.",
        "Denim jacket, size medium."
      ];
      const userIds = ["user-1", "user-2", "user-3", "user-4", userId]; // Include current user ID for testing

      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const latOffset = (Math.random() - 0.5) * 0.1;
        const lngOffset = (Math.random() - 0.5) * 0.1;

        items.push({
          id: `item-${i + 1}`,
          type: type,
          title: `${type === 'lost' ? 'Lost' : 'Found'}: ${titles[Math.floor(Math.random() * titles.length)]}`,
          description: descriptions[Math.floor(Math.random() * descriptions.length)] + ` Item ID: ${i+1}`,
          imageUrl: `https://picsum.photos/400/300?random=${i+1}`,
          location: locations[Math.floor(Math.random() * locations.length)],
          date: date,
          lat: 34.0522 + latOffset,
          lng: -118.2437 + lngOffset,
          userId: userIds[Math.floor(Math.random() * userIds.length)],
        });
      }
      return items;
    };

  const allMockItems = generateMockItems(30); // Generate some items
  return allMockItems.filter(item => item.userId === userId);
};
// --- End Mock Data Fetching ---

const ITEMS_PER_PAGE = 8; // Items per page for the dashboard list

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Pagination state for user items
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to home
    if (!loading && !user) {
      router.push('/');
      return; // Stop further execution in this effect
    }

    // If user is available, fetch their items
    if (user) {
      setIsLoadingItems(true);
      fetchUserItems(user.uid)
        .then(items => {
          setUserItems(items);
          setTotalPages(Math.ceil(items.length / ITEMS_PER_PAGE));
          setCurrentPage(1); // Reset to first page when items load/change
        })
        .catch(error => {
          console.error("Error fetching user items:", error);
          // Handle error display (e.g., show a toast)
        })
        .finally(() => {
          setIsLoadingItems(false);
        });
    }
  }, [user, loading, router]);

  // Update total pages if userItems changes (e.g., after deleting an item - future feature)
  useEffect(() => {
    const newTotalPages = Math.ceil(userItems.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);
    // Reset to page 1 if the current page becomes invalid
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    } else if (newTotalPages === 0) {
        setCurrentPage(1); // Or 0 if you prefer
    }
  }, [userItems, currentPage]);


  // Calculate items for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUserItemsPage = userItems.slice(startIndex, endIndex);

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
       window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top on page change
    }
  };


  // Show loading state while checking auth or fetching items
  if (loading || isLoadingItems) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
           <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
             <Skeleton className="h-6 w-1/2 mb-2" />
             <Skeleton className="h-4 w-3/4" />
           </div>
           <div className="mb-4">
              <Skeleton className="h-8 w-1/4" />
           </div>
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => ( // Show skeletons for one page
              <Card key={i} className="w-full animate-pulse"> {/* Added pulse animation */}
                 <CardHeader className='p-0'>
                    <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />
                 </CardHeader>
                 <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex items-center space-x-2 pt-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-1/3" />
                     </div>
                 </CardContent>
              </Card>
            ))}
           </div>
        </div>
      );
  }

  // Should not happen if redirection works, but as a fallback
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen"> {/* Ensure min height */}
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.displayName || user.email}!</h2>
        <p className="text-muted-foreground">Here you can manage your reported items and messages.</p>
        {/* Add profile edit button or link here later */}
        {/* <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button> */}
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Reported Items</h2>
        {userItems.length > 0 ? (
          <>
            <ItemList items={currentUserItemsPage} />
             {totalPages > 1 && (
                <div className="mt-12 flex justify-center"> {/* Increased margin top */}
                   <Pagination>
                     <PaginationContent>
                       <PaginationItem>
                         <PaginationPrevious
                           href="#"
                           onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                           aria-disabled={currentPage <= 1}
                           tabIndex={currentPage <= 1 ? -1 : undefined}
                           className={cn(
                              "transition-opacity",
                             currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"
                           )}
                         />
                       </PaginationItem>
                       {/* Simplified Pagination Links */}
                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                           <PaginationItem key={page}>
                           <PaginationLink
                              href="#"
                              onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                              isActive={currentPage === page}
                              className="transition-colors" // Add transition
                           >
                              {page}
                           </PaginationLink>
                           </PaginationItem>
                       ))}
                       <PaginationItem>
                         <PaginationNext
                           href="#"
                           onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                           aria-disabled={currentPage >= totalPages}
                           tabIndex={currentPage >= totalPages ? -1 : undefined}
                            className={cn(
                              "transition-opacity",
                              currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"
                            )}
                         />
                       </PaginationItem>
                     </PaginationContent>
                   </Pagination>
                </div>
             )}
          </>
        ) : (
          <p className="text-center text-muted-foreground mt-12">You haven't reported any items yet.</p>
        )}
      </section>

      {/* Add Messaging Section Later */}
      {/* <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">My Messages</h2>
        <p className="text-muted-foreground">Messaging feature coming soon!</p>
      </section> */}
    </div>
  );
}


