
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoreBranch, Store } from "@/types/admin";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface StoreBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: StoreBranch | null;
  stores: Store[];
  onSubmit: () => void;
}

export default function StoreBranchDialog({
  open,
  onOpenChange,
  branch,
  stores,
  onSubmit,
}: StoreBranchDialogProps) {
  const [formData, setFormData] = useState<Partial<StoreBranch>>(
    branch || {
      store_id: "",
      retailer_id: "",
      branch_id: "",
      country: "",
      city: "",
      street: "",
      house_number: "",
      zip_code: "",
      latitude: undefined,
      longitude: undefined,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedStore = stores.find(s => s.id === formData.store_id);
      if (selectedStore) {
        formData.retailer_id = selectedStore.retailer_id;
      }

      if (branch) {
        const { error } = await supabase
          .from('store_branches')
          .update(formData)
          .eq('id', branch.id);
        
        if (error) throw error;
        toast.success('Branch updated successfully');
      } else {
        const { error } = await supabase
          .from('store_branches')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Branch created successfully');
      }
      
      onSubmit();
    } catch (error: any) {
      toast.error(branch ? 'Failed to update branch: ' : 'Failed to create branch: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_id">Store</Label>
            <Select
              value={formData.store_id}
              onValueChange={(value) =>
                setFormData({ ...formData, store_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.store_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch_id">Branch ID</Label>
              <Input
                id="branch_id"
                value={formData.branch_id}
                onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="house_number">House Number</Label>
              <Input
                id="house_number"
                value={formData.house_number}
                onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch_url">Branch URL</Label>
              <Input
                id="branch_url"
                type="url"
                value={formData.branch_url}
                onChange={(e) => setFormData({ ...formData, branch_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offers_url">Offers URL</Label>
              <Input
                id="offers_url"
                type="url"
                value={formData.offers_url}
                onChange={(e) => setFormData({ ...formData, offers_url: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {branch ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
