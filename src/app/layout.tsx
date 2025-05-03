
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
  title: 'Lost & Found', // Updated Title
  description: 'Platform for reporting and finding lost items locally.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden`}>
         <ThemeProvider
          attribute="class"
          defaultTheme="light" // Ensure default theme is light
          enableSystem={false} // Explicitly disable system preference if default is set
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

