import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Retailer, IntegrationType } from "@/types/admin";
import { createRetailer, updateRetailer } from "@/services/retailerApi";
import { toast } from "sonner";

interface RetailerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retailer: Retailer | null;
  onSubmit: () => void;
}

export default function RetailerDialog({
  open,
  onOpenChange,
  retailer,
  onSubmit,
}: RetailerDialogProps) {
  const [formData, setFormData] = useState<Partial<Retailer>>(
    retailer || {
      name: "",
      website: "",
      countries: [],
      integration_type: "MANUAL" as IntegrationType,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (retailer) {
        await updateRetailer(retailer.id, formData);
        toast.success('Retailer updated successfully');
      } else {
        await createRetailer(formData);
        toast.success('Retailer created successfully');
      }
      
      onSubmit();
    } catch (error: any) {
      toast.error(retailer ? 'Failed to update retailer: ' : 'Failed to create retailer: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{retailer ? 'Edit Retailer' : 'Add Retailer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Countries (comma-separated)</Label>
            <Input
              id="countries"
              value={formData.countries?.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                countries: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
              })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="integration_type">Integration Type</Label>
            <Select
              value={formData.integration_type}
              onValueChange={(value: IntegrationType) =>
                setFormData({ ...formData, integration_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select integration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="SCRAPER">Scraper</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {retailer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
