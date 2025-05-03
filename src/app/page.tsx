
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// import { ItemList } from "@/components/item-list"; // Removed ItemList import
import type { Item, ItemType } from "@/types/item";
import { ItemForm, ItemFormValues } from '@/components/item-form';
// import { SearchFilterBar, SearchFilters } from '@/components/search-filter-bar'; // Removed SearchFilterBar import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Search, FilePlus, ThumbsUp, ArrowRight } from 'lucide-react'; // Updated icons
// import { getCurrentLocation } from '@/services/location'; // Removed location service import for now
// import type { Location } from '@/services/location';
// import { Skeleton } from '@/components/ui/skeleton'; // Removed Skeleton import
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'; // Correct import for Card components
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useToast } from '@/hooks/use-toast'; // Import useToast hook
// import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Removed Pagination import
import Link from 'next/link'; // Import Link

// --- Removed Mock Data generation and fetching logic from this page ---
// --- Removed Haversine formula ---

export default function Home() {
  // Keep state relevant to the form dialog trigger
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Handle form submission (keep this logic)
  const handleFormSubmit = async (values: ItemFormValues) => {
     if (!user) {
       toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to report an item." });
       setIsFormOpen(false); // Close dialog if not logged in
       return;
     }

    setIsSubmitting(true);
    console.log("Submitting item:", values);

    // Simulate API call for submission
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
      lat: undefined, // Add logic later if needed
      lng: undefined,
    };

    // TODO: Instead of adding locally, trigger a refetch or update a global state if items are managed elsewhere
    console.log("New item created (locally):", newItem);
    // setAllItems(prevItems => [newItem, ...prevItems]); // Remove local state update
    // applyFilters(activeFilters); // Remove local filter update

    setIsSubmitting(false);
    setIsFormOpen(false); // Close the dialog on successful submission
    toast({ title: "Item Reported", description: "Your item has been successfully reported." });
  };

  // Function to trigger the Report Item dialog
  const openReportDialog = () => {
      if (!user && !authLoading) {
          toast({ variant: "destructive", title: "Login Required", description: "Please log in to report an item." });
      } else if (!authLoading) {
         setIsFormOpen(true);
      }
      // Do nothing if auth is still loading
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Reconnect with Your Lost Belongings
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Our Lost and Found platform helps people reunite with their valuable items through a simple, secure, and community-driven approach.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Updated Button styling to match image */}
             <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base" asChild>
               <Link href="/items"> {/* Link to a page where items are listed */}
                  <Search className="mr-2 h-5 w-5" /> Find Lost Items
               </Link>
             </Button>
             <Button variant="outline" size="lg" onClick={openReportDialog} disabled={authLoading} className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base">
              <FilePlus className="mr-2 h-5 w-5" /> Report Found Item
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10 text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50">
              <CardHeader className="items-center">
                 <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                    <Search className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="text-xl">Search for Items</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Browse through our database of lost and found items to see if yours has been reported. Use filters to narrow down your search.
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50">
              <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                    <FilePlus className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="text-xl">Report an Item</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Found something? Lost something? Quickly submit details to our platform to help it find its way home.
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50">
              <CardHeader className="items-center">
                 <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
                    <ThumbsUp className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="text-xl">Get Connected</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Our secure messaging system helps you connect with the finder or owner of the item safely and efficiently.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

        {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-cta-purple text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Lost Items?</h2>
              <p className="max-w-2xl mx-auto text-lg mb-8 text-primary-foreground/80">
                 Join thousands of people who have successfully reconnected with their belongings.
              </p>
              {/* Use a dark button style on the purple background */}
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 px-8 py-3 text-base" asChild>
                   <Link href="/items"> {/* Link to the items page */}
                      Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
              </Button>
          </div>
      </section>

      {/* Item Reporting Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
         {/* DialogTrigger is handled by the buttons above */}
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
           {/* Optional: Add explicit close button if needed */}
          {/* <DialogClose asChild>
             <Button type="button" variant="secondary">Cancel</Button>
           </DialogClose> */}
        </DialogContent>
      </Dialog>

      {/* Removed ItemList and SearchFilterBar components from here */}
      {/* Removed Pagination */}
    </div>
  );
}
