import React, { useState } from 'react';
import { Plus, X, ShoppingCart, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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
  const [newItem, setNewItem] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim().toLowerCase(),
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

  const optimizeTrip = () => {
    if (items.length === 0) {
      toast.error("Add items to your list first");
      return;
    }

    const recommendations: StoreRecommendation[] = [];
    const itemsByStore: Record<string, string[]> = {};

    // Simple optimization algorithm (mock data)
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

    // Convert to recommendations
    Object.entries(itemsByStore).forEach(([store, storeItems]) => {
      recommendations.push({
        storeName: store,
        items: storeItems,
        totalSavings: Math.random() * 10, // Mock savings calculation
        distance: mockStoreData[store].distance
      });
    });

    setShowRecommendations(true);
    toast.success("Shopping trip optimized!");
    return recommendations;
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

      <ul className="space-y-2 mb-4">
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

      {showRecommendations && items.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Recommended Stores</h3>
          {optimizeTrip().map((rec, index) => (
            <Card key={index} className="animate-slideIn">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{rec.storeName}</span>
                  <span className="text-sm text-gray-500">{rec.distance}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Items: {rec.items.join(", ")}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Estimated savings: ${rec.totalSavings.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};