import React, { useState, useEffect } from 'react';
import { Route, ShoppingCart, Copy, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AddItemForm } from './shopping/AddItemForm';
import { ItemsList } from './shopping/ItemsList';
import { StoreRecommendations } from './shopping/StoreRecommendations';
import { getStoreRecommendations } from '../services/recommendationsApi';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  labels: string[];
  brand?: string;
}

interface SavedList {
  id: string;
  name: string;
  items: ShoppingItem[];
  created: string;
}

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [userZipCode, setUserZipCode] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    const saved = localStorage.getItem('savedShoppingLists');
    return saved ? JSON.parse(saved) : [];
  });
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('savedShoppingLists', JSON.stringify(savedLists));
  }, [savedLists]);

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

  const saveCurrentList = () => {
    if (items.length === 0) {
      toast.error("Add items to your list before saving");
      return;
    }
    if (!newListName.trim()) {
      toast.error("Please enter a name for your list");
      return;
    }

    const newList: SavedList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      items: items,
      created: new Date().toISOString(),
    };

    setSavedLists([...savedLists, newList]);
    setNewListName('');
    toast.success("Shopping list saved!");
  };

  const loadList = (listId: string) => {
    const list = savedLists.find(l => l.id === listId);
    if (list) {
      setItems(list.items);
      toast.success(`Loaded list: ${list.name}`);
    }
  };

  const duplicateList = (listId: string) => {
    const list = savedLists.find(l => l.id === listId);
    if (list) {
      const newList: SavedList = {
        ...list,
        id: Date.now().toString(),
        name: `${list.name} (Copy)`,
        created: new Date().toISOString(),
      };
      setSavedLists([...savedLists, newList]);
      setItems(list.items);
      toast.success("List duplicated and loaded");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Shopping List</h2>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Shopping List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <Button onClick={saveCurrentList} className="w-full">
                Save List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {savedLists.length > 0 && (
        <div className="mb-4 flex gap-2">
          <Select value={selectedList} onValueChange={(value) => {
            setSelectedList(value);
            loadList(value);
          }}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Load saved list" />
            </SelectTrigger>
            <SelectContent>
              {savedLists.map((list) => (
                <SelectItem
                  key={list.id}
                  value={list.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center justify-between w-full pr-2">
                    <span>{list.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateList(list.id);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
