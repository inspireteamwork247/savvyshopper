
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  labels: string[];
  brand?: string;
}

interface ItemsListProps {
  items: ShoppingItem[];
  onRemoveItem: (id: string) => void;
}

export const ItemsList = ({ items, onRemoveItem }: ItemsListProps) => {
  return (
    <ul className="space-y-2 mb-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded animate-slideIn"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>{item.name}</span>
              {item.brand && (
                <Badge variant="outline" className="text-xs">
                  {item.brand}
                </Badge>
              )}
              <Badge variant="outline">{item.quantity}</Badge>
            </div>
            {item.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
};
