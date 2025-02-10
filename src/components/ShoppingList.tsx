
import React, { useState, useEffect } from 'react';
import { Route, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AddItemForm } from './shopping/AddItemForm';
import { ItemsList } from './shopping/ItemsList';
import { StoreRecommendations } from './shopping/StoreRecommendations';
import { getStoreRecommendations } from '../services/recommendationsApi';
import { useQuery } from '@tanstack/react-query';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  labels: string[];
  brand?: string;
}

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [userZipCode, setUserZipCode] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enter your ZIP code.');
        }
      );
    }
  }, []);

  const { data: recommendations, refetch: fetchRecommendations, isLoading } = useQuery({
    queryKey: ['storeRecommendations', items, userZipCode, userLocation],
    queryFn: async () => {
      if (items.length === 0 || !userZipCode || !userLocation) return null;
      
      const request = {
        products: items.map(item => `${item.name} ${item.quantity}${item.brand ? ` ${item.brand}` : ''}`),
        zip_code: userZipCode,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        labels: items.flatMap(item => item.labels),
      };

      return await getStoreRecommendations(request);
    },
    enabled: false,
  });

  const addItem = (itemName: string, quantity: string, labels: string[], brand?: string) => {
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName.toLowerCase(),
      quantity,
      labels,
      brand,
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
      await fetchRecommendations();
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
          disabled={isLoading || !userZipCode}
        >
          <Route className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading recommendations...' : 'Optimize Shopping Trip'}
        </Button>
      )}

      {recommendations && recommendations.length > 0 && (
        <StoreRecommendations recommendations={recommendations} />
      )}
    </div>
  );
};
