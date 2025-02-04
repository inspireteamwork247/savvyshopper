import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AddItemFormProps {
  onAddItem: (itemName: string) => void;
}

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    onAddItem(newItem.trim());
    setNewItem('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
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
  );
};