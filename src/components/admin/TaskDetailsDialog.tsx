
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CrawlerTask, Store } from "@/types/admin";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: CrawlerTask | null;
  stores: Store[];
}

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  stores,
}: TaskDetailsDialogProps) {
  if (!task) return null;

  const store = stores.find(s => s.id === task.store_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            Detailed information about this crawler task
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Task ID</h3>
                <p className="text-sm">{task.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Store</h3>
                <p className="text-sm">{store?.store_name || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Type</h3>
                <p className="text-sm">{task.scraper_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Status</h3>
                <p className={`text-sm ${
                  task.status === 'SUCCESS' ? 'text-green-500' :
                  task.status === 'FAILURE' ? 'text-red-500' :
                  task.status === 'RUNNING' ? 'text-blue-500' : ''
                }`}>
                  {task.status}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Created</h3>
                <p className="text-sm">{new Date(task.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                <p className="text-sm">{new Date(task.updated_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Last Run</h3>
                <p className="text-sm">{task.last_run ? new Date(task.last_run).toLocaleString() : 'Never'}</p>
              </div>
            </div>

            {task.url_pattern && (
              <div>
                <h3 className="text-sm font-medium mb-1">URL Pattern</h3>
                <p className="text-sm break-all">{task.url_pattern}</p>
              </div>
            )}

            {task.sitemap_url && (
              <div>
                <h3 className="text-sm font-medium mb-1">Sitemap URL</h3>
                <p className="text-sm break-all">{task.sitemap_url}</p>
              </div>
            )}

            {task.index_urls && task.index_urls.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Index URLs</h3>
                <ul className="list-disc pl-5 text-sm">
                  {task.index_urls.map((url, index) => (
                    <li key={index} className="break-all">{url}</li>
                  ))}
                </ul>
              </div>
            )}

            {task.schedule_times && task.schedule_times.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Schedule Times</h3>
                <ul className="list-disc pl-5 text-sm">
                  {task.schedule_times.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
            )}

            {task.selectors && Object.keys(task.selectors).length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Selectors</h3>
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(task.selectors, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
