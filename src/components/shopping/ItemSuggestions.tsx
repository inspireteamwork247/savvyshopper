
import React from 'react';
import { Card } from '@/components/ui/card';

interface ItemSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  suggestionsRef: React.RefObject<HTMLDivElement>;
}

export const ItemSuggestions = ({ suggestions, onSelect, suggestionsRef }: ItemSuggestionsProps) => {
  return (
    <Card
      ref={suggestionsRef}
      className="absolute z-50 w-full max-h-48 overflow-y-auto mt-1 bg-white shadow-lg rounded-md"
    >
      <div className="p-1">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-sm"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </Card>
  );
};
