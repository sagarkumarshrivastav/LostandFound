
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, LogIn, UserPlus, LayoutDashboard, LogOut, Search, FilePlus, FileQuestion, HomeIcon, RefreshCcw } from 'lucide-react'; // Added HomeIcon, Search, FilePlus, FileQuestion, RefreshCcw
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';


export function Header() {
  const { user, loading, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false); // State for Report Item dialog
  const router = useRouter();
  const { toast } = useToast(); // Import useToast

  // Ensure component is mounted before rendering theme toggle to avoid hydration mismatch
  useEffect(() => {
      setMounted(true);
      // Set dark theme by default if theme is not set
      if (!theme) {
          setTheme('dark');
      }
  }, [setTheme, theme]);


  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show toast)
    }
  };

   const getInitials = (email?: string | null) => {
      if (!email) return '??';
      return email.substring(0, 2).toUpperCase();
   }

   const openReportDialog = () => {
       if (!user && !loading) {
           toast({ variant: "destructive", title: "Login Required", description: "Please log in to report an item." });
       } else if (!loading) {
          // Redirect or open dialog - for now, let's assume a route /report exists or open a dialog
           // setIsReportDialogOpen(true); // If using a dialog within the header (less common for forms)
           router.push('/#report-item'); // Or navigate to a section/page
           // If using the main page dialog, trigger it (needs state management/context)
           // For simplicity, let's just navigate or rely on main page logic
       }
       // Do nothing if auth is still loading
   }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4"> {/* Increased height slightly */}
        <Link href="/" className="flex items-center space-x-2">
          <RefreshCcw className="h-6 w-6 text-primary" /> {/* Use an icon */}
          <span className="font-bold text-xl text-foreground">Lost & Found</span> {/* Updated Brand Name */}
        </Link>

        <nav className="hidden items-center space-x-6 md:flex"> {/* Hide on small screens initially */}
         {/* Navigation Links */}
         <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Home</Link>
         <Link href="/#search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Lost Items</Link> {/* Point to search/list area */}
         <Link href="/#search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Found Items</Link> {/* Point to search/list area */}
          {/* Report Item - can be a link or trigger */}
          <Button variant="ghost" size="sm" onClick={openReportDialog} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" disabled={loading}>
             Report Item
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            {mounted && (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            </Button>
            )}

            {/* Auth Section */}
            {loading ? (
                <Button variant="ghost" size="sm" disabled className="text-muted-foreground">Loading...</Button>
            ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full"> {/* Slightly larger avatar */}
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/dashboard">
                     <LayoutDashboard className="mr-2 h-4 w-4" />
                     <span>Dashboard</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
             <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                    {/* Use a ghost button for sign in to match image */}
                    <Button variant="ghost" size="sm" className="text-sm font-medium text-foreground hover:text-primary">
                        Sign In
                     </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Sign In</DialogTitle>
                        <DialogDescription>
                         Access your account or sign in with Google.
                        </DialogDescription>
                    </DialogHeader>
                     <AuthForm mode="login" onSuccess={() => setIsLoginOpen(false)} />
                     {/* Removed DialogClose to rely on onSuccess */}
                </DialogContent>
              </Dialog>

               {/* Sign Up Button (Primary style) */}
               <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign Up
                    </Button>
                </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Sign Up</DialogTitle>
                        <DialogDescription>
                         Create an account or sign up with Google.
                        </DialogDescription>
                    </DialogHeader>
                     <AuthForm mode="signup" onSuccess={() => setIsSignupOpen(false)} />
                     {/* Removed DialogClose to rely on onSuccess */}
                </DialogContent>
              </Dialog>

            </div>
          )}

            {/* Mobile Menu Trigger (Optional - Add if needed) */}
            {/* <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
            </Button> */}
        </div>
      </div>
    </header>
  );
}

// Dummy useToast if not fully implemented elsewhere for Header usage
const useToast = () => ({
    toast: (options: { variant?: string, title: string, description: string }) => {
        console.log("Toast:", options.title, options.description);
        // In a real app, this would trigger the actual toast component
        alert(`${options.title}: ${options.description}`);
    }
});
