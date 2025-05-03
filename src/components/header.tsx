
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
import { Moon, Sun, LogIn, UserPlus, LayoutDashboard, LogOut, Search, FilePlus, FileQuestion, HomeIcon, RefreshCcw, Loader2, UserCircle } from 'lucide-react';
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
import { useToast } from "@/hooks/use-toast";


export function Header() {
  const { user, loading, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false); // State for Report Item dialog
  const router = useRouter();
  const { toast } = useToast();

  // Ensure component is mounted before rendering theme toggle to avoid hydration mismatch
  useEffect(() => {
      setMounted(true);
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/'); // Redirect to home after logout
    } catch (error: any) {
      console.error("Logout failed:", error);
       toast({ variant: "destructive", title: "Logout Failed", description: error?.message || "Could not log out. Please try again." });
    }
  };

   const getInitials = (email?: string | null) => {
       if (!email) return '??';
       const namePart = email.split('@')[0];
       if (namePart.includes('.')) {
            // Use initials from parts split by dot
           return namePart.split('.').map(n => n[0]).join('').substring(0, 2).toUpperCase();
       }
       // Default to first two chars of email name part
       return namePart.substring(0, 2).toUpperCase();
   }

   const openReportDialog = () => {
       if (!user && !loading) {
           toast({ variant: "destructive", title: "Login Required", description: "Please log in to report an item." });
       } else if (!loading) {
          // Option 1: Navigate to a dedicated report page
           // router.push('/report');
          // Option 2: Scroll to a section on the home page (if applicable)
          // router.push('/#report-item');
          // Option 3: Open a dialog (requires ItemForm to be available, like on ItemsPage)
           setIsReportDialogOpen(true); // Assuming we add a dialog here or use a global one
       }
       // Do nothing if auth is still loading
   }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6"> {/* Use justify-between */}
        {/* Left Section: Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <RefreshCcw className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-[-45deg]" />
          <span className="font-bold text-xl text-foreground">Lost & Found</span>
        </Link>

        {/* Center Section: Navigation Links */}
        <nav className="hidden items-center justify-center space-x-6 md:flex flex-grow"> {/* Use flex-grow and justify-center */}
         <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Home</Link>
         <Link href="/items" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Lost Items</Link>
         <Link href="/items" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Found Items</Link>
          {/* Report Item button - adjusted style */}
          <Button variant="ghost" size="sm" onClick={() => router.push('/items#report-item')} className="text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary px-3" disabled={loading}>
             Report Item
          </Button>
        </nav>

        {/* Right Section: Auth and Theme Controls */}
        <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
                // Use background from theme, ensure smooth transition
                className="bg-transparent transition-transform transform hover:scale-110 duration-300 hover:bg-accent rounded-full"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            </Button>
            )}

            {/* Auth Section */}
            {loading ? (
                 <Button variant="ghost" size="sm" disabled className="text-muted-foreground flex items-center px-3">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Loading...
                 </Button>
            ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-transform transform hover:scale-110 duration-300">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
                   <Link href="/profile">
                     <UserCircle className="mr-2 h-4 w-4" />
                     <span>Profile</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
                   <Link href="/dashboard">
                     <LayoutDashboard className="mr-2 h-4 w-4" />
                     <span>Dashboard</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-accent">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2"> {/* Use gap here as well */}
             <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3">
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
                </DialogContent>
              </Dialog>

               <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4" disabled={loading}>
                         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                </DialogContent>
              </Dialog>

            </div>
          )}
        </div>
      </div>

      {/* Dialog for reporting item (optional, if needed directly in header) */}
       <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
             <DialogHeader>
                 <DialogTitle>Report a Lost or Found Item</DialogTitle>
                 <DialogDescription>
                     Fill in the details below. Be as specific as possible.
                 </DialogDescription>
             </DialogHeader>
             <div className="py-4">
                 {/* ItemForm needs onSubmit and isSubmitting props passed */}
                 {/* Example: <ItemForm onSubmit={handleHeaderFormSubmit} isSubmitting={isHeaderSubmitting} /> */}
                 {/* You'd need to manage submission state specific to this dialog */}
                 <p className="text-center text-muted-foreground">Reporting form would appear here.</p>
                 <p className="text-center text-xs text-muted-foreground">(Please use the 'Report Item' button on the Items page for now)</p>
             </div>
         </DialogContent>
       </Dialog>
    </header>
  );
}

