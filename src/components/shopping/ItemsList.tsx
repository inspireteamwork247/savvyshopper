import React from 'react';
import { X } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
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
          <span>{item.name}</span>
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