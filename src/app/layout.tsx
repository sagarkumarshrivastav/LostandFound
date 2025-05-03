
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a common sans-serif font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer'; // Import Footer
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define variable for Inter font
});


export const metadata: Metadata = {
  title: 'FindIt Local', // Updated Title based on recent changes
  description: 'Platform for reporting and finding lost items locally.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden`}> {/* Removed extra space before body, added overflow-x-hidden */}
         <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Set default theme to dark
          enableSystem={false} // Disable system preference to enforce dark theme initially
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
