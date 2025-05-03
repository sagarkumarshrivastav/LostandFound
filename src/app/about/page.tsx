
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Target } from "lucide-react"; // Example icons

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
        About FindIt Local
      </h1>

      <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        FindIt Local is dedicated to helping communities reconnect lost items with their rightful owners. We believe that a small act of kindness, like returning a lost item, can make a big difference.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Our Mission</CardTitle>
            <Target className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              To provide a simple, efficient, and trustworthy platform for reporting and finding lost and found items within local communities, fostering honesty and helpfulness.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">How It Works</CardTitle>
            <Info className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Users report lost or found items with details.</li>
              <li>Posts become publicly visible for searching.</li>
              <li>Use filters to narrow down potential matches.</li>
              <li>Connect securely via our messaging system.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Community Focused</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We aim to build stronger, more connected neighborhoods by facilitating the return of lost possessions and encouraging mutual support among residents.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
         <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
         <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Whether you've lost something valuable or found an item that needs returning, FindIt Local is here to help. Sign up today and become part of a network of helpful neighbors.
         </p>
         {/* Optional: Add a link/button to signup */}
         {/* <Button asChild><Link href="/signup">Get Started</Link></Button> */}
      </div>
    </div>
  );
}
