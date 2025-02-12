
import React from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FavoriteFiltersProps {
  selectedLabels: string[];
  onApplyFilter: (labels: string[]) => void;
  favoriteFilters: { name: string; labels: string[] }[];
  setFavoriteFilters: React.Dispatch<React.SetStateAction<{ name: string; labels: string[] }[]>>;
}

export const FavoriteFilters = ({
  selectedLabels,
  onApplyFilter,
  favoriteFilters,
  setFavoriteFilters
}: FavoriteFiltersProps) => {
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
    onApplyFilter(filter.labels);
    toast.success(`Applied ${filter.name} filter`);
  };

  const deleteFavoriteFilter = (filterName: string) => {
    setFavoriteFilters(favoriteFilters.filter(filter => filter.name !== filterName));
    toast.success("Filter set deleted");
  };

  return (
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
  );
};
