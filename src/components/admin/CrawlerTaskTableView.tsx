
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { CrawlerTask, Store, Retailer } from "@/types/admin";

interface CrawlerTaskTableViewProps {
  tasks: CrawlerTask[];
  stores: Store[];
  retailers: Retailer[];
  storeId?: string;
  retailerId?: string;
  onEditTask: (task: CrawlerTask) => void;
  onDeleteTask: (id: string) => void;
  onRunTask: (task: CrawlerTask) => void;
  onViewDetails: (task: CrawlerTask) => void;
}

export default function CrawlerTaskTableView({
  tasks,
  stores,
  retailers,
  storeId,
  retailerId,
  onEditTask,
  onDeleteTask,
  onRunTask,
  onViewDetails
}: CrawlerTaskTableViewProps) {
  // If storeId is provided, filter tasks for that store
  const filteredTasks = storeId
    ? tasks.filter(task => task.store_id === storeId)
    : retailerId
    ? tasks.filter(task => {
        const taskStore = stores.find(s => s.id === task.store_id);
        return taskStore && taskStore.retailer_id === retailerId;
      })
    : tasks;

  const getRetailerName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return "Unknown";
    
    const retailer = retailers.find(r => r.id === store.retailer_id);
    return retailer?.name || "Unknown";
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>URL Pattern</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => {
            const store = stores.find(s => s.id === task.store_id);
            return (
              <TableRow key={task.id}>
                <TableCell>{store?.store_name || 'Unknown'}</TableCell>
                <TableCell>{getRetailerName(task.store_id)}</TableCell>
                <TableCell>{task.scraper_type}</TableCell>
                <TableCell>
                  {task.url_pattern ? (
                    <a
                      href={task.url_pattern}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      URL <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={
                    task.status === 'SUCCESS' ? 'text-green-500' :
                    task.status === 'FAILURE' ? 'text-red-500' :
                    task.status === 'RUNNING' ? 'text-blue-500' : ''
                  }>
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  {task.last_run ? new Date(task.last_run).toLocaleString() : 'Never'}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRunTask(task)}
                  >
                    Run
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(task)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredTasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No crawler tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
