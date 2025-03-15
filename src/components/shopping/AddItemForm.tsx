
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ItemSuggestions } from './ItemSuggestions';
import { LabelSelect } from './LabelSelect';
import { BarcodeScanner } from './BarcodeScanner';
import { VoiceInput } from './VoiceInput';
import { commonItems } from './constants';

interface AddItemFormProps {
  onAddItem: (itemName: string, quantity: string, labels: string[]) => void;
}

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
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
    
    onAddItem(newItem.trim(), "1", selectedLabels);
    setNewItem('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLabels([]);
  };

  const handleScan = (barcode: string) => {
    toast.success(`Scanned barcode: ${barcode}`);
    onAddItem(`Item ${barcode}`, "1", selectedLabels);
  };

  const handleVoiceInput = (text: string) => {
    setNewItem(text);
    toast.success('Voice input received');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              value={newItem}
              onChange={handleInputChange}
              placeholder="Add an item..."
              className="flex-1"
              onFocus={() => newItem.trim() && setShowSuggestions(true)}
            />
            <VoiceInput onVoiceInput={handleVoiceInput} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsScannerOpen(true)}
            >
              <Barcode className="h-4 w-4" />
            </Button>
          </div>

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

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};
