import React, { useState } from 'react';
import { Route, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AddItemForm } from './shopping/AddItemForm';
import { ItemsList } from './shopping/ItemsList';
import { StoreRecommendations } from './shopping/StoreRecommendations';
import { krogerApi } from '../services/krogerApi';
import { useQuery } from '@tanstack/react-query';

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

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<StoreRecommendation[]>([]);
  const [userZipCode, setUserZipCode] = useState('');

  const { data: nearbyStores, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores', userZipCode],
    queryFn: () => krogerApi.getNearbyStores(userZipCode),
    enabled: !!userZipCode,
  });

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

  const optimizeTrip = async () => {
    if (items.length === 0) {
      toast.error("Add items to your list first");
      return;
    }

    if (!userZipCode) {
      toast.error("Please enter your ZIP code first");
      return;
    }

    try {
      const stores = await krogerApi.getNearbyStores(userZipCode);
      const recommendations: StoreRecommendation[] = [];

      for (const store of stores) {
        const storeItems = [];
        let totalSavings = 0;

        for (const item of items) {
          const products = await krogerApi.getProductPrices(store.locationId, item.name);
          if (products.length > 0) {
            const bestPrice = Math.min(...products.map(p => p.price.regular));
            storeItems.push(item.name);
            totalSavings += products[0].price.regular - bestPrice;
          }
        }

        if (storeItems.length > 0) {
          recommendations.push({
            storeName: store.name,
            items: storeItems,
            totalSavings,
            distance: `${(Math.random() * 5).toFixed(1)} miles`, // In a real app, you'd calculate this
          });
        }
      }

      setRecommendations(recommendations);
      setShowRecommendations(true);
      toast.success("Shopping trip optimized!");
    } catch (error) {
      console.error('Error optimizing trip:', error);
      toast.error("Failed to optimize shopping trip. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Shopping List</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your ZIP code"
          value={userZipCode}
          onChange={(e) => setUserZipCode(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <AddItemForm onAddItem={addItem} />
      <ItemsList items={items} onRemoveItem={removeItem} />

      {items.length > 0 && (
        <Button 
          onClick={optimizeTrip}
          className="w-full mb-4"
          variant="outline"
          disabled={isLoadingStores || !userZipCode}
        >
          <Route className="w-4 h-4 mr-2" />
          {isLoadingStores ? 'Loading stores...' : 'Optimize Shopping Trip'}
        </Button>
      )}

      {showRecommendations && recommendations.length > 0 && (
        <StoreRecommendations recommendations={recommendations} />
      )}
    </div>
  );
};