import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Retailer } from "@/types/admin";
import { createStore, updateStore } from "@/services/storeApi";
import { toast } from "sonner";

interface StoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
  retailers: Retailer[];
  onSubmit: () => void;
}

export default function StoreDialog({
  open,
  onOpenChange,
  store,
  retailers,
  onSubmit,
}: StoreDialogProps) {
  const [formData, setFormData] = useState<Partial<Store>>(
    store || {
      retailer_id: "",
      store_name: "",
      country: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (store) {
        await updateStore(store.id, formData);
        toast.success('Store updated successfully');
      } else {
        await createStore(formData);
        toast.success('Store created successfully');
      }
      
      onSubmit();
    } catch (error: any) {
      toast.error(store ? 'Failed to update store: ' : 'Failed to create store: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{store ? 'Edit Store' : 'Add Store'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retailer_id">Retailer</Label>
            <Select
              value={formData.retailer_id}
              onValueChange={(value) =>
                setFormData({ ...formData, retailer_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retailer" />
              </SelectTrigger>
              <SelectContent>
                {retailers.map((retailer) => (
                  <SelectItem key={retailer.id} value={retailer.id}>
                    {retailer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input
              id="store_name"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {store ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
