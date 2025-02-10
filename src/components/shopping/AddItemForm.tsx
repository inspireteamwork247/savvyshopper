
import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface AddItemFormProps {
  onAddItem: (itemName: string) => void;
}

// Common grocery items for suggestions
const commonItems = [
  'Milk', 'Bread', 'Eggs', 'Cheese', 'Butter',
  'Yogurt', 'Chicken', 'Rice', 'Pasta', 'Tomatoes',
  'Onions', 'Potatoes', 'Bananas', 'Apples', 'Orange Juice',
  'Coffee', 'Tea', 'Sugar', 'Salt', 'Pepper'
];

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    onAddItem(newItem.trim());
    setNewItem('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newItem}
          onChange={handleInputChange}
          placeholder="Add an item..."
          className="flex-1"
          onFocus={() => newItem.trim() && setShowSuggestions(true)}
        />
        <Button type="submit" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card
          ref={suggestionsRef}
          className="absolute z-50 w-full max-h-48 overflow-y-auto mt-1 bg-white shadow-lg rounded-md"
        >
          <div className="p-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
