import type { Item } from '@/types/item';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="p-0">
        {item.imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="lost found item image"
            />
            <Badge
              variant={item.type === 'lost' ? 'destructive' : 'secondary'}
              className="absolute top-2 right-2"
            >
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </Badge>
          </div>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-secondary">
             <Badge
              variant={item.type === 'lost' ? 'destructive' : 'secondary'}
              className="absolute top-2 right-2 z-10"
            >
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </Badge>
            <span className="text-muted-foreground">No Image Available</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-lg">{item.title}</CardTitle>
        <CardDescription className="mb-4 line-clamp-3 h-[60px]">
          {item.description}
        </CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-1 h-4 w-4" />
          <span>{format(item.date, 'PPP')}</span>
        </div>
      </CardContent>
      {/* CardFooter can be used for actions later */}
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter> */}
    </Card>
  );
}
