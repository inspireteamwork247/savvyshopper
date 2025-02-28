
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface LocationFilterProps {
  country: string;
  setCountry: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  onReset: () => void;
}

export default function LocationFilter({
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  onReset
}: LocationFilterProps) {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Location Filters</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onReset}
          title="Reset filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="country"
              placeholder="Filter by country..."
              className="pl-8"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Region</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="state"
              placeholder="Filter by state/region..."
              className="pl-8"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="city"
              placeholder="Filter by city..."
              className="pl-8"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
