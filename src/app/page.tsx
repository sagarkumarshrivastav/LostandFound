
"use client";

import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { Button } from "@/components/ui/button";
import { ItemForm, ItemFormValues } from '@/components/item-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Search, FilePlus, ThumbsUp, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'; // Ensure Card is imported
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Import motion for animations


export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Handle form submission (keep this logic, but adapt for API call)
  const handleFormSubmit = async (values: ItemFormValues) => {
     if (!user) {
       toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to report an item." });
       setIsFormOpen(false); // Close dialog if not logged in
       return;
     }

    setIsSubmitting(true);
    console.log("Submitting item:", values);

    // TODO: Replace simulation with actual API call to the backend
    // Use FormData if uploading image, otherwise JSON
    try {
       // Example using axios (assuming you have it installed and configured)
       // const formData = new FormData();
       // formData.append('type', values.type);
       // ... append other fields
       // if (values.image) formData.append('image', values.image);
       //
       // const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }};
       // await axios.post(`${API_URL}/items`, formData, config);

       // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log locally for now - replace with API call success handling
       console.log("Simulated item submission successful:", values);

      toast({ title: "Item Reported", description: "Your item has been successfully reported." });
      setIsFormOpen(false); // Close the dialog on successful submission
       // Optionally: Trigger a refetch of items on the main items page if needed
    } catch (error: any) {
        console.error("Error submitting item:", error);
        toast({ variant: 'destructive', title: 'Submission Failed', description: error.response?.data?.msg || 'Could not report item.' });
    } finally {
       setIsSubmitting(false);
    }
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

   // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden"> {/* Prevent horizontal scroll */}

      {/* Hero Section - Removed 3D Tilt Effect */}
      <motion.section
        className="w-full py-20 md:py-32 lg:py-40 bg-background text-foreground overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Reconnect with Your Lost Belongings
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Our Lost and Found platform helps people reunite with their valuable items through a simple, secure, and community-driven approach.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
             <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base transition-transform transform hover:scale-105 duration-300" asChild>
               <Link href="/items">
                  <Search className="mr-2 h-5 w-5" /> Find Lost Items
               </Link>
             </Button>
             <Button variant="outline" size="lg" onClick={openReportDialog} disabled={authLoading} className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base transition-transform transform hover:scale-105 duration-300">
              {authLoading ? (
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                 <FilePlus className="mr-2 h-5 w-5" />
              )}
               Report Found Item
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="w-full py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10 text-foreground"
         initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div variants={cardVariants}>
                <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Search className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Search for Items</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    Browse through our database of lost and found items to see if yours has been reported. Use filters to narrow down your search.
                </CardContent>
                </Card>
            </motion.div>
             {/* Card 2 */}
            <motion.div variants={cardVariants} transition={{ delay: 0.1 }}>
                <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <FilePlus className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Report an Item</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    Found something? Lost something? Quickly submit details to our platform to help it find its way home.
                </CardContent>
                </Card>
            </motion.div>
            {/* Card 3 */}
            <motion.div variants={cardVariants} transition={{ delay: 0.2 }}>
                <Card className="bg-card text-card-foreground shadow-md dark:border dark:border-border/50 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <ThumbsUp className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Get Connected</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    Our secure messaging system helps you connect with the finder or owner of the item safely and efficiently.
                </CardContent>
                </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

        {/* CTA Section */}
      <motion.section
        className="w-full py-16 md:py-24 bg-cta-purple text-primary-foreground"
         initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Lost Items?</h2>
              <p className="max-w-2xl mx-auto text-lg mb-8 text-primary-foreground/80">
                 Join thousands of people who have successfully reconnected with their belongings.
              </p>
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 px-8 py-3 text-base transition-transform transform hover:scale-105 duration-300" asChild>
                   <Link href="/items">
                      Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
              </Button>
          </div>
      </motion.section>

      {/* Item Reporting Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
  );
}
