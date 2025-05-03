
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Linkedin, RefreshCcw } from 'lucide-react'; // Example social icons, added RefreshCcw

export function Footer() {
  return (
    <footer className="bg-secondary/30 dark:bg-background border-t border-border text-muted-foreground py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About/Brand Section */}
          <div className="space-y-3">
             <Link href="/" className="flex items-center space-x-2 group w-fit"> {/* Added group and w-fit */}
                 <RefreshCcw className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-[-45deg]" />
                 <h3 className="text-lg font-semibold text-foreground">Lost & Found</h3> {/* Updated Brand Name */}
             </Link>
            <p className="text-sm text-muted-foreground">
              Connecting communities by helping reunite people with their lost belongings. Report or find items easily and securely.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">About Us</Link></li>
               <li><Link href="/items" className="text-muted-foreground hover:text-primary transition-colors duration-200">Browse Items</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/policy" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

           {/* Social Media Links */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
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
              Email: <a href="mailto:info@lostandfound.com" className="hover:text-primary transition-colors duration-200">info@lostandfound.com</a> {/* Updated Email */}
            </p>
          </div>
        </div>

        <Separator className="bg-border my-6" />

        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lost & Found. All rights reserved. {/* Updated Copyright */}
        </div>
      </div>
    </footer>
  );
}
