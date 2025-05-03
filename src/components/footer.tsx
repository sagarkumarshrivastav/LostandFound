
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'; // Example social icons

export function Footer() {
  return (
    <footer className="bg-secondary/30 dark:bg-background border-t border-border text-muted-foreground py-8 mt-auto"> {/* Use background in dark mode */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* About/Brand Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Lost & Found</h3>
            <p className="text-sm text-muted-foreground">
              Connecting communities by helping reunite people with their lost belongings. Report or find items easily and securely.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
               <li><Link href="/items" className="text-muted-foreground hover:text-primary transition-colors">Browse Items</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Address/Contact Info */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Our Location</h4>
            <p className="text-sm text-muted-foreground">
              123 Lost & Found Lane,<br />
              Somewhere City, SC 12345<br />
              United States
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Email: <a href="mailto:info@finditlocal.com" className="hover:text-primary transition-colors">info@lostandfound.com</a>
            </p>
          </div>
        </div>

        <Separator className="bg-border my-6" />

        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lost & Found. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
