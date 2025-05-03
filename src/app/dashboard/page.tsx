
"use client";

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // Use axios for API calls
import { useRouter } from 'next/navigation';
import type { Item, PaginatedItemsResponse } from '@/types/item'; // Updated Item type
import { ItemList } from '@/components/item-list';
// import { Button } from '@/components/ui/button'; // Not currently used here
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ITEMS_PER_PAGE = 8; // Items per page for the dashboard list

export default function DashboardPage() {
  const { user, loading: authLoading, token } = useAuth(); // Get user, loading state, and token
  const router = useRouter();
  const { toast } = useToast();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Pagination state for user items
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

   // Fetch user-specific items
   const fetchUserItems = useCallback(async (userId: string, page: number) => {
     if (!token) {
        console.warn("Dashboard: No token available to fetch user items.");
        setIsLoadingItems(false); // Stop loading if no token
        // Optionally redirect to login if token is expected but missing
        // router.push('/login');
        return;
     }
     setIsLoadingItems(true);
     try {
       const params = new URLSearchParams({
         page: page.toString(),
         limit: ITEMS_PER_PAGE.toString(),
         userId: userId, // Filter by user ID
         sortBy: 'createdAt',
         order: 'desc',
       });
       const config = { headers: { 'x-auth-token': token } }; // Send token

       const res = await axios.get<PaginatedItemsResponse>(`${API_URL}/items?${params.toString()}`, config);
       setUserItems(res.data.items);
       setTotalPages(res.data.totalPages);
       setCurrentPage(res.data.currentPage);

     } catch (error: any) {
       console.error("Error fetching user items:", error);
       toast({ variant: 'destructive', title: 'Error Loading Items', description: error.response?.data?.msg || 'Could not load your items.' });
       setUserItems([]);
       setTotalPages(1);
       setCurrentPage(1);
     } finally {
       setIsLoadingItems(false);
     }
   }, [toast, token]); // Added token dependency

  // Effect to handle redirection and initial fetch
   useEffect(() => {
     // If auth is done loading and there's no user, redirect to home
     if (!authLoading && !user) {
        console.log("Dashboard: Not logged in, redirecting...");
       router.push('/');
       return;
     }

     // If user is available, fetch their items for the current page
     if (user) {
        // console.log(`Dashboard: User ${user._id} found, fetching items for page ${currentPage}`);
       fetchUserItems(user._id, currentPage);
     }
     // Dependency: Re-run if auth state changes or if page changes
   }, [user, authLoading, router, fetchUserItems, currentPage]);


  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Update page state, useEffect triggers refetch
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  // Show loading state while checking auth or fetching items
  if (authLoading || (isLoadingItems && !userItems.length)) { // Show skeleton if loading OR initial item fetch is happening
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
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="w-full animate-pulse">
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.displayName || user.email || 'User'}!</h2>
        <p className="text-muted-foreground">Here you can manage your reported items.</p>
        {/* <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/profile')}>Edit Profile</Button> */}
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Reported Items</h2>
         {/* Display loading specifically for items if needed */}
         {isLoadingItems && userItems.length > 0 && (
             <div className="text-center py-4">
                 <Loader2 className="h-6 w-6 animate-spin inline-block text-primary" />
                 <p className="text-muted-foreground">Loading items...</p>
             </div>
         )}

         {!isLoadingItems && userItems.length === 0 ? (
             <p className="text-center text-muted-foreground mt-12">You haven't reported any items yet.</p>
         ) : !isLoadingItems && userItems.length > 0 ? (
           <>
             <ItemList items={userItems} />
              {totalPages > 1 && (
                 <div className="mt-12 flex justify-center">
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                            <PaginationLink
                               href="#"
                               onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                               isActive={currentPage === page}
                               className="transition-colors"
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
         ) : null /* Render nothing if loading but no items yet (handled by main loading block) */}
       </section>


      {/* Messaging Section Placeholder */}
      {/* <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">My Messages</h2>
        <p className="text-muted-foreground">Messaging feature coming soon!</p>
      </section> */}
    </div>
  );
}
