
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ItemList } from "@/components/item-list";
import type { Item, ItemType } from "@/types/item";
import { ItemForm, ItemFormValues } from '@/components/item-form'; // Keep for reporting dialog if needed here too
import { SearchFilterBar, SearchFilters } from '@/components/search-filter-bar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';
import { getCurrentLocation } from '@/services/location';
import type { Location } from '@/services/location';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Correct import for Card components
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useToast } from '@/hooks/use-toast'; // Import useToast hook
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Import Pagination

// --- Mock Data (Keep or fetch from API) ---
const generateMockItems = (count: number): Item[] => {
  const items: Item[] = [];
  const types: ItemType[] = ['lost', 'found'];
  const titles = ["Keys", "Wallet", "Phone", "Backpack", "Laptop", "Book", "Glasses", "Watch", "Umbrella", "Jacket", "Ring", "Headphones", "Scarf", "Gloves", "ID Card"];
  const locations = ["Park", "Cafe", "Bus Stop", "Library", "Train Station", "Supermarket", "Office Building", "University Campus", "Restaurant", "Shopping Mall", "Airport", "Gym", "Cinema", "Beach", "Museum"];
  const descriptions = [
    "Found near the main entrance, looks new.",
    "Lost on the number 12 bus, green line.",
    "Black leather wallet with several cards and some cash.",
    "iPhone 14 Pro, deep purple, slight scratch on corner.",
    "Dell XPS laptop in a grey sleeve, contains work files.",
    "Hardcover copy of 'The Midnight Library'.",
    "Ray-Ban prescription glasses, black frame.",
    "Silver Seiko wristwatch, leather strap is worn.",
    "Large collapsible black umbrella with wooden handle.",
    "Blue North Face denim jacket, size medium.",
    "Gold band ring, might be valuable.",
    "Sony WH-1000XM4 headphones, black.",
    "Woolen scarf, red and grey pattern.",
    "Black leather gloves, seems like a pair.",
    "University ID card for Jane Doe."
  ];
  const userIds = ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6"]; // Mock user IDs

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Within the last 90 days
    const latOffset = (Math.random() - 0.5) * 0.2; // Slightly wider offset
    const lngOffset = (Math.random() - 0.5) * 0.2; // Slightly wider offset

    items.push({
      id: `item-${i + 1}`,
      type: type,
      title: `${type === 'lost' ? 'Lost' : 'Found'}: ${titles[Math.floor(Math.random() * titles.length)]}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)] + ` Item ID: ${i+1}`,
      imageUrl: `https://picsum.photos/400/300?random=${i+1}`, // Placeholder image
      location: locations[Math.floor(Math.random() * locations.length)],
      date: date,
      lat: 34.0522 + latOffset, // Centered around LA
      lng: -118.2437 + lngOffset,
      userId: userIds[Math.floor(Math.random() * userIds.length)], // Assign a mock user ID
    });
  }
  return items;
};
// --- End Mock Data ---

// --- Haversine formula ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const ITEMS_PER_PAGE = 12; // Adjust items per page if needed

export default function ItemsPage() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({ keyword: '', proximity: 10 });
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const { toast } = useToast(); // Get toast function

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call or fetch data
    setTimeout(() => {
      const mockItems = generateMockItems(50); // Generate items
      setAllItems(mockItems);
      setFilteredItems(mockItems); // Initially show all items
      setTotalPages(Math.ceil(mockItems.length / ITEMS_PER_PAGE));
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, []);

   // Update total pages whenever filtered items change
   useEffect(() => {
     setTotalPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
     if (currentPage > Math.ceil(filteredItems.length / ITEMS_PER_PAGE)) {
       setCurrentPage(1);
     }
   }, [filteredItems, currentPage]);


  // Function to handle getting current location
  const handleGetCurrentLocation = async () => {
    setIsSearchingLocation(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      applyFilters({ ...activeFilters, proximity: activeFilters.proximity ?? 10 });
      toast({ title: "Location Found", description: "Current location updated." });
    } catch (error) {
      console.error("Error getting location:", error);
      toast({ variant: "destructive", title: "Location Error", description: "Could not get your current location." });
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Function to apply filters
  const applyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
    setIsLoading(true);
    setCurrentPage(1);

    let tempFiltered = [...allItems];

    // Filter by keyword
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      tempFiltered = tempFiltered.filter(item =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.location.toLowerCase().includes(lowerKeyword)
      );
    }

    // Filter by date
    if (filters.date) {
        const filterDate = new Date(filters.date);
        filterDate.setHours(0, 0, 0, 0);
        tempFiltered = tempFiltered.filter(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === filterDate.getTime();
        });
    }

    // Filter by proximity
    if (filters.proximity && currentLocation) {
      tempFiltered = tempFiltered.filter(item => {
        if (item.lat && item.lng) {
          const distance = calculateDistance(currentLocation.lat, currentLocation.lng, item.lat, item.lng);
          return distance <= filters.proximity!;
        }
        return false; // Exclude items without coords when proximity filter is on
      });
    }

    // Simulate filtering delay
    setTimeout(() => {
        setFilteredItems(tempFiltered);
        setIsLoading(false);
    }, 300);
  };


  // Handle form submission
  const handleFormSubmit = async (values: ItemFormValues) => {
     if (!user) {
       toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to report an item." });
       return;
     }

    setIsSubmitting(true);
    console.log("Submitting item:", values);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItem: Item = {
      id: `item-${Date.now()}`,
      type: values.type as ItemType,
      title: values.title,
      description: values.description,
      imageUrl: values.image ? `https://picsum.photos/400/300?random=${Date.now()}` : undefined,
      location: values.location,
      date: values.date,
      userId: user.uid,
      lat: currentLocation?.lat,
      lng: currentLocation?.lng,
    };

    const updatedAllItems = [newItem, ...allItems];
    setAllItems(updatedAllItems);
    applyFilters(activeFilters);

    setIsSubmitting(false);
    setIsFormOpen(false);
    toast({ title: "Item Reported", description: "Your item has been successfully reported." });
  };

  const openReportDialog = () => {
      if (!user && !authLoading) {
          toast({ variant: "destructive", title: "Login Required", description: "Please log in to report an item." });
      } else if (!authLoading) {
         setIsFormOpen(true);
      }
  }

   // Calculate items for the current page
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const endIndex = startIndex + ITEMS_PER_PAGE;
   const currentItems = filteredItems.slice(startIndex, endIndex);

   const handlePageChange = (newPage: number) => {
     if (newPage >= 1 && newPage <= totalPages) {
       setCurrentPage(newPage);
       window.scrollTo(0, 0);
     }
   };


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Lost & Found Items</h1>
        <div className="mb-8 flex flex-col items-center justify-end gap-4 md:flex-row">
            {/* Reporting button */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openReportDialog} disabled={authLoading} className="w-full md:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" /> Report Item
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
                        <ItemForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>


        <SearchFilterBar
          onSearch={applyFilters}
          isSearchingLocation={isSearchingLocation}
          onGetCurrentLocation={handleGetCurrentLocation}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="w-full">
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
              <ItemList items={currentItems} />
              {totalPages > 1 && (
                 <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                            aria-disabled={currentPage <= 1}
                            tabIndex={currentPage <= 1 ? -1 : undefined}
                            className={
                              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                            }
                          />
                        </PaginationItem>
                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                             <PaginationItem key={page}>
                             <PaginationLink
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                isActive={currentPage === page}
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
                             className={
                               currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                             }
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
