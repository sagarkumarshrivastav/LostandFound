
import type { Item } from '@/types/item';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // Import parseISO

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  // Parse the ISO string date before formatting
  const formattedDate = item.dateLostOrFound ? format(parseISO(item.dateLostOrFound), 'PPP') : 'Date unknown';

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden"> {/* Added overflow-hidden */}
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="lost found item image"
              className="transition-transform duration-300 ease-in-out group-hover:scale-105" // Scale image on hover
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-secondary transition-colors duration-300 group-hover:bg-muted">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
           <Badge
            variant={item.type === 'lost' ? 'destructive' : 'secondary'}
            className="absolute top-2 right-2 z-10" // Ensure badge is above image
          >
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-lg">{item.title}</CardTitle>
        <CardDescription className="mb-4 line-clamp-3 h-[60px] text-muted-foreground">
          {item.description}
        </CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.location}</span> {/* Added truncate */}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-1 h-4 w-4 flex-shrink-0" />
          <span>{formattedDate}</span> {/* Use the formatted date */}
        </div>
      </CardContent>
      {/* CardFooter can be used for actions later */}
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="transition-colors">View Details</Button>
      </CardFooter> */}
    </Card>
  );
}
