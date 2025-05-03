
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
import { Moon, Sun, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is installed for dark mode
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


export function Header() {
  const { user, loading, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Ensure component is mounted before rendering theme toggle to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show toast)
    }
  };

   const getInitials = (email?: string | null) => {
      if (!email) return '??';
      return email.substring(0, 2).toUpperCase();
   }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* Add your logo here if you have one */}
          <span className="font-bold text-primary">FindIt Local</span>
        </Link>

        <nav className="flex items-center space-x-4">
         {/* Add other navigation links here if needed */}
         {/* e.g., <Link href="/browse" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Browse</Link> */}

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}

          {/* Auth Section */}
          {loading ? (
             <Button variant="ghost" size="sm" disabled>Loading...</Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
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
                 {/* Add other user-specific items like Profile, Settings etc. */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
             <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogIn className="mr-1 h-4 w-4" /> Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                        <DialogDescription>
                         Access your account or login with Google.
                        </DialogDescription>
                    </DialogHeader>
                     <AuthForm mode="login" onSuccess={() => setIsLoginOpen(false)} />
                     <DialogClose />
                </DialogContent>
              </Dialog>

               <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                <DialogTrigger asChild>
                   <Button size="sm">
                      <UserPlus className="mr-1 h-4 w-4" /> Sign Up
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
                     <DialogClose />
                </DialogContent>
              </Dialog>

            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
