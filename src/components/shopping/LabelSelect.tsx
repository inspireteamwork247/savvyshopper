
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { labelCategories } from './constants';

interface LabelSelectProps {
  selectedLabels: string[];
  onLabelSelect: (label: string) => void;
  onRemoveLabel: (label: string) => void;
}

export const LabelSelect = ({
  selectedLabels,
  onLabelSelect,
  onRemoveLabel
}: LabelSelectProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {Object.entries(labelCategories).map(([category, labels]) => (
          <div key={category}>
            <Select onValueChange={onLabelSelect}>
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
                onClick={() => onRemoveLabel(label)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
