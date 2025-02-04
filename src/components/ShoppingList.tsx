import React, { useState } from 'react';
import { Plus, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
}

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      quantity: 1,
    };
    setItems([...items, item]);
    setNewItem('');
    toast.success("Item added to list");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Item removed from list");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Shopping List</h2>
      </div>

      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded animate-slideIn"
          >
            <span>{item.name}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};