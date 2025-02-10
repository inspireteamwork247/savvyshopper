import React, { useState, useRef, useEffect } from 'react';
import { Plus, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddItemFormProps {
  onAddItem: (itemName: string, quantity: string, labels: string[], brand?: string) => void;
}

// Common grocery items and their brands
const itemBrands = {
  'Milk': ['Organic Valley', 'Horizon', 'Lactaid', 'Fairlife', 'Store Brand'],
  'Bread': ['Wonder', 'Nature\'s Own', 'Dave\'s Killer Bread', 'Sara Lee', 'Store Brand'],
  'Yogurt': ['Chobani', 'Yoplait', 'Dannon', 'Siggi\'s', 'Store Brand'],
  'Coffee': ['Starbucks', 'Folgers', 'Maxwell House', 'Peet\'s', 'Store Brand'],
  'Cereal': ['Kellogg\'s', 'General Mills', 'Post', 'Quaker', 'Store Brand'],
};

// Common grocery items for suggestions
const commonItems = [
  'Milk', 'Bread', 'Eggs', 'Cheese', 'Butter',
  'Yogurt', 'Chicken', 'Rice', 'Pasta', 'Tomatoes',
  'Onions', 'Potatoes', 'Bananas', 'Apples', 'Orange Juice',
  'Coffee', 'Tea', 'Sugar', 'Salt', 'Pepper'
];

const quantities = {
  'Milk': ['250ml', '500ml', '1L', '2L'],
  'Yogurt': ['125g', '250g', '500g'],
  'Rice': ['500g', '1kg', '2kg', '5kg'],
  'default': ['1', '2', '3', '4', '5']
};

const labelCategories = {
  'Dietary': ['Vegan', 'Vegetarian', 'Keto', 'Halal', 'Kosher', 'Gluten-Free'],
  'Allergies': ['Contains Nuts', 'Contains Soy', 'Contains Dairy', 'Contains Eggs'],
  'Health': ['Sugar Free', 'Low Fat', 'Low Sodium', 'High Protein'],
  'Packaging': ['Plastic Free', 'Recyclable', 'Biodegradable']
};

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

  const handleLabelSelect = (label: string) => {
    if (!selectedLabels.includes(label)) {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const removeLabel = (label: string) => {
    setSelectedLabels(selectedLabels.filter(l => l !== label));
  };

  const saveFavoriteFilter = () => {
    if (selectedLabels.length === 0) {
      toast.error("Select some labels first");
      return;
    }
    
    const filterName = prompt("Enter a name for this filter set:");
    if (!filterName) return;

    if (favoriteFilters.some(filter => filter.name === filterName)) {
      toast.error("A filter with this name already exists");
      return;
    }

    setFavoriteFilters([...favoriteFilters, { name: filterName, labels: selectedLabels }]);
    toast.success("Filter set saved!");
  };

  const applyFavoriteFilter = (filter: { name: string; labels: string[] }) => {
    setSelectedLabels(filter.labels);
    toast.success(`Applied ${filter.name} filter`);
  };

  const deleteFavoriteFilter = (filterName: string) => {
    setFavoriteFilters(favoriteFilters.filter(filter => filter.name !== filterName));
    toast.success("Filter set deleted");
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={saveFavoriteFilter}
            className="flex items-center gap-1"
          >
            <Star className="w-4 h-4" />
            Save Filter Set
          </Button>
          {favoriteFilters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Favorite Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {favoriteFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="flex-1 cursor-pointer"
                      onClick={() => applyFavoriteFilter(filter)}
                    >
                      {filter.name}
                    </span>
                    <X
                      className="w-4 h-4 text-destructive cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFavoriteFilter(filter.name);
                      }}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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

      <div className="space-y-2">
        {Object.entries(labelCategories).map(([category, labels]) => (
          <div key={category}>
            <Select onValueChange={handleLabelSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${category}`} />
              </SelectTrigger>
              <SelectContent>
                {labels.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((label) => (
            <Badge key={label} variant="secondary" className="flex items-center gap-1">
              {label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeLabel(label)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
