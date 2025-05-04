"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Use axios for API calls
import { Button } from "@/components/ui/button";
import { ItemList } from "@/components/item-list";
import type { Item, PaginatedItemsResponse, ItemType } from "@/types/item"; // Updated Item type
import { ItemForm, ItemFormValues } from '@/components/item-form';
import { SearchFilterBar, SearchFilters } from '@/components/search-filter-bar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from 'lucide-react';
import { getCurrentLocation } from '@/services/location'; // Assuming this remains relevant
import type { Location } from '@/services/location';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ITEMS_PER_PAGE = 12;

export default function ItemsPage() {
  // State for items and loading
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Auth state
  const { user, loading: authLoading, token } = useAuth();
  const { toast } = useToast();

  // Filters and Location State
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({ keyword: '', proximity: 10 });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch items from backend API
   const fetchItems = useCallback(async (filters: SearchFilters, page: number) => {
     setIsLoading(true);
     try {
       const params = new URLSearchParams({
         page: page.toString(),
         limit: ITEMS_PER_PAGE.toString(),
         sortBy: 'createdAt', // Default sort
         order: 'desc',
         ...(filters.keyword && { keyword: filters.keyword }),
         ...(filters.type && { type: filters.type }),
         ...(filters.location && { location: filters.location }), // Pass location filter if present
         ...(filters.date && { date: filters.date.toISOString().split('T')[0] }), // Format date as YYYY-MM-DD
          // Add proximity params if location is available
         // ...(currentLocation && filters.proximity && {
         //     lat: currentLocation.lat.toString(),
         //     lng: currentLocation.lng.toString(),
         //     proximity: filters.proximity.toString()
         // })
       });

       const res = await axios.get<PaginatedItemsResponse>(`${API_URL}/items?${params.toString()}`);
       setItems(res.data.items);
       setTotalPages(res.data.totalPages);
       setCurrentPage(res.data.currentPage); // Sync with backend's current page

     } catch (error: any) {
       console.error('Error fetching items:', error);
       toast({ variant: 'destructive', title: 'Error Fetching Items', description: error.message || error.response?.data?.msg || 'Could not load items.' });
       setItems([]); // Clear items on error
       setTotalPages(1);
       setCurrentPage(1);
     } finally {
       setIsLoading(false);
     }
   }, [toast]); // Removed currentLocation dependency for now

    // Initial fetch and refetch on filter/page change
    useEffect(() => {
        fetchItems(activeFilters, currentPage);
    }, [activeFilters, currentPage, fetchItems]);


   // --- Location Handling (Keep as is or adjust) ---
   const handleGetCurrentLocation = async () => {
     setIsSearchingLocation(true);
     try {
       const location = await getCurrentLocation();
       setCurrentLocation(location);
       // Re-apply filters with the new location and default proximity
       // Note: Proximity filtering needs backend implementation
       setActiveFilters(prev => ({ ...prev, proximity: prev.proximity ?? 10 })); // Trigger refetch
       toast({ title: "Location Found", description: "Current location updated." });
     } catch (error) {
       console.error("Error getting location:", error);
       toast({ variant: "destructive", title: "Location Error", description: "Could not get your current location." });
     } finally {
       setIsSearchingLocation(false);
     }
   };

   // Function to apply filters and trigger refetch
   const applyFilters = (filters: SearchFilters) => {
     setActiveFilters(filters); // Update active filters state
     setCurrentPage(1); // Reset to page 1 when filters change
     // fetchItems will be called by the useEffect hook due to state change
   };

  // Handle item form submission
  const handleFormSubmit = async (values: ItemFormValues) => {
     if (!user || !token) {
       toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to report an item." });
       return;
     }

    setIsSubmitting(true);

    // Use FormData to handle potential file uploads
    const formData = new FormData();
    formData.append('type', values.type);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('dateLostOrFound', values.date.toISOString()); // Send ISO string date
    if (values.image) {
        formData.append('image', values.image); // Append the file object
    }
    // Append lat/lng if available
    // if (currentLocation) {
    //     formData.append('lat', currentLocation.lat.toString());
    //     formData.append('lng', currentLocation.lng.toString());
    // }

    try {
      const config = {
          headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': token, // Send JWT token
          },
      };
      await axios.post(`${API_URL}/items`, formData, config);

      toast({ title: "Item Reported", description: "Your item has been successfully reported." });
      setIsFormOpen(false); // Close dialog
      fetchItems(activeFilters, 1); // Refetch items on page 1 to see the new one
      setCurrentPage(1); // Ensure we are on page 1

    } catch (error: any) {
      console.error("Error submitting item:", error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.response?.data?.msg || 'Could not report item.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  // Open report dialog, checking auth status
  const openReportDialog = () => {
      if (!user && !authLoading) {
          toast({ variant: "destructive", title: "Login Required", description: "Please log in to report an item." });
          // Optionally redirect to login or open login modal
      } else if (!authLoading) { // Only open if not loading and user exists
         setIsFormOpen(true);
      }
  }

   // Handle pagination change
   const handlePageChange = (newPage: number) => {
     if (newPage >= 1 && newPage <= totalPages) {
       setCurrentPage(newPage); // Update page state, useEffect will trigger refetch
       window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
     }
   };


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Lost & Found Items</h1>
        <div className="mb-8 flex flex-col items-center justify-end gap-4 md:flex-row">
            {/* Reporting button */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                     {/* Disable button while auth is loading */}
                    <Button onClick={openReportDialog} disabled={authLoading} className="w-full md:w-auto transition-colors">
                         {/* Show loader if auth is loading */}
                        {authLoading ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <PlusCircle className="mr-2 h-4 w-4" />
                        )}
                         Report Item
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Report a Lost or Found Item</DialogTitle>
                        <DialogDescription>
                            Fill in the details below. Be as specific as possible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                         {/* Pass onSubmit and isSubmitting state */}
                        <ItemForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>


        <SearchFilterBar
          onSearch={applyFilters} // Pass the applyFilters function
          isSearchingLocation={isSearchingLocation}
          onGetCurrentLocation={handleGetCurrentLocation}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {/* Skeleton Loader */}
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
        ) : (
           <>
             {/* Item List */}
              {items.length > 0 ? (
                   <ItemList items={items} />
              ) : (
                  <p className="text-center text-muted-foreground mt-12">No items match your current filters.</p>
              )}
             {/* Pagination */}
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
                         {/* Generate page links */}
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
        )}
    </div>
  );
}
