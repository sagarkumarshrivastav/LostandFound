import type { Item } from '@/types/item';
import { ItemCard } from './item-card';

interface ItemListProps {
  items: Item[];
}

export function ItemList({ items }: ItemListProps) {
  if (!items || items.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
