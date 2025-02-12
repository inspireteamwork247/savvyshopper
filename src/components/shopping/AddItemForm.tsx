
import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemSuggestions } from './ItemSuggestions';
import { LabelSelect } from './LabelSelect';
import { FavoriteFilters } from './FavoriteFilters';
import { itemBrands, commonItems, quantities } from './constants';

interface AddItemFormProps {
  onAddItem: (itemName: string, quantity: string, labels: string[], brand?: string) => void;
}

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [favoriteFilters, setFavoriteFilters] = useState<{ name: string; labels: string[] }[]>(() => {
    const saved = localStorage.getItem('favoriteFilters');
    return saved ? JSON.parse(saved) : [];
  });
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteFilters', JSON.stringify(favoriteFilters));
  }, [favoriteFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem(value);

    if (value.trim()) {
      const filtered = commonItems.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewItem(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    const brands = itemBrands[suggestion as keyof typeof itemBrands] || [];
    setAvailableBrands(brands);
    setSelectedBrand('');
    setQuantity('');
  };

  const getQuantityOptions = (item: string) => {
    const itemLower = item.toLowerCase();
    for (const [key, values] of Object.entries(quantities)) {
      if (itemLower.includes(key.toLowerCase())) {
        return values;
      }
    }
    return quantities.default;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!quantity) {
      toast.error("Please select a quantity");
      return;
    }
    onAddItem(newItem.trim(), quantity, selectedLabels, selectedBrand);
    setNewItem('');
    setQuantity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLabels([]);
    setSelectedBrand('');
    setAvailableBrands([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <FavoriteFilters
          selectedLabels={selectedLabels}
          onApplyFilter={setSelectedLabels}
          favoriteFilters={favoriteFilters}
          setFavoriteFilters={setFavoriteFilters}
        />
      </div>

      <div className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newItem}
            onChange={handleInputChange}
            placeholder="Add an item..."
            className="flex-1"
            onFocus={() => newItem.trim() && setShowSuggestions(true)}
          />
          {newItem && (
            <>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {getQuantityOptions(newItem).map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableBrands.length > 0 && (
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
          <Button type="submit" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ItemSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
            suggestionsRef={suggestionsRef}
          />
        )}
      </div>

      <LabelSelect
        selectedLabels={selectedLabels}
        onLabelSelect={(label) => {
          if (!selectedLabels.includes(label)) {
            setSelectedLabels([...selectedLabels, label]);
          }
        }}
        onRemoveLabel={(label) => {
          setSelectedLabels(selectedLabels.filter(l => l !== label));
        }}
      />
    </div>
  );
};
