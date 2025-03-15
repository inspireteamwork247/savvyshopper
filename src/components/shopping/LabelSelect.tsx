
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const commonLabels = ['Essential', 'Urgent', 'Optional', 'Bulk'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {commonLabels.map(label => (
          <Badge 
            key={label} 
            variant="outline" 
            className="cursor-pointer hover:bg-secondary"
            onClick={() => !selectedLabels.includes(label) && onLabelSelect(label)}
          >
            {label}
          </Badge>
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
