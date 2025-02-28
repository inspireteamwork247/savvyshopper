
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrawlerTask, Store, ScraperType, TaskStatus } from "@/types/admin";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CrawlerTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: CrawlerTask | null;
  stores: Store[];
  onSubmit: () => void;
}

export default function CrawlerTaskDialog({
  open,
  onOpenChange,
  task,
  stores,
  onSubmit,
}: CrawlerTaskDialogProps) {
  const [formData, setFormData] = useState<Partial<CrawlerTask>>(
    task || {
      store_id: "",
      scraper_type: "INDEXER" as ScraperType,
      url_pattern: "",
      status: "PENDING" as TaskStatus,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (task) {
        const { error } = await supabase
          .from('crawler_tasks')
          .update(formData)
          .eq('id', task.id);
        
        if (error) throw error;
        toast.success('Task updated successfully');
      } else {
        const { error } = await supabase
          .from('crawler_tasks')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Task created successfully');
      }
      
      onSubmit();
    } catch (error: any) {
      toast.error(task ? 'Failed to update task: ' : 'Failed to create task: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="scraper_type">Scraper Type</Label>
            <Select
              value={formData.scraper_type}
              onValueChange={(value: ScraperType) =>
                setFormData({ ...formData, scraper_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scraper type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDEXER">Indexer</SelectItem>
                <SelectItem value="SCRAPE_PRODUCT_CSS">Scrape Product (CSS)</SelectItem>
                <SelectItem value="SCRAPE_PRODUCT_LLM">Scrape Product (LLM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_pattern">URL Pattern</Label>
            <Input
              id="url_pattern"
              type="url"
              value={formData.url_pattern}
              onChange={(e) => setFormData({ ...formData, url_pattern: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TaskStatus) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILURE">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
