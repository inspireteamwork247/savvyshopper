import React, { useState } from 'react';
import { Route, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AddItemForm } from './shopping/AddItemForm';
import { ItemsList } from './shopping/ItemsList';
import { StoreRecommendations } from './shopping/StoreRecommendations';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
}

interface StoreRecommendation {
  storeName: string;
  items: string[];
  totalSavings: number;
  distance: string;
}

const mockStoreData = {
  "FreshMart": { distance: "0.5 miles", prices: { "milk": 2.99, "bread": 2.49, "eggs": 3.99 } },
  "SuperSave": { distance: "1.2 miles", prices: { "milk": 3.49, "bread": 1.99, "eggs": 3.49 } },
  "MegaMarket": { distance: "2.0 miles", prices: { "milk": 2.79, "bread": 2.29, "eggs": 2.99 } }
};

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<StoreRecommendation[]>([]);

  const addItem = (itemName: string) => {
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName.toLowerCase(),
      quantity: 1,
    };
    setItems([...items, item]);
    toast.success("Item added to list");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Item removed from list");
  };

  const optimizeTrip = () => {
    if (items.length === 0) {
      toast.error("Add items to your list first");
      return;
    }

    const itemsByStore: Record<string, string[]> = {};

    items.forEach(item => {
      let bestPrice = Infinity;
      let bestStore = '';
      
      Object.entries(mockStoreData).forEach(([store, data]) => {
        const price = data.prices[item.name.toLowerCase()] || Infinity;
        if (price < bestPrice) {
          bestPrice = price;
          bestStore = store;
        }
      });

      if (bestStore) {
        if (!itemsByStore[bestStore]) {
          itemsByStore[bestStore] = [];
        }
        itemsByStore[bestStore].push(item.name);
      }
    });

    const newRecommendations = Object.entries(itemsByStore).map(([store, storeItems]) => ({
      storeName: store,
      items: storeItems,
      totalSavings: Math.random() * 10,
      distance: mockStoreData[store].distance
    }));

    setRecommendations(newRecommendations);
    setShowRecommendations(true);
    toast.success("Shopping trip optimized!");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Shopping List</h2>
      </div>

      <AddItemForm onAddItem={addItem} />
      <ItemsList items={items} onRemoveItem={removeItem} />

      {items.length > 0 && (
        <Button 
          onClick={optimizeTrip}
          className="w-full mb-4"
          variant="outline"
        >
          <Route className="w-4 h-4 mr-2" />
          Optimize Shopping Trip
        </Button>
      )}

      {showRecommendations && recommendations.length > 0 && (
        <StoreRecommendations recommendations={recommendations} />
      )}
    </div>
  );
};