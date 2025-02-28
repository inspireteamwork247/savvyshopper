
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Store, StoreBranch, CrawlerTask, Retailer } from "@/types/admin";
import { useNavigate } from "react-router-dom";

interface StoreTableViewProps {
  stores: Store[];
  branches: StoreBranch[];
  tasks: CrawlerTask[];
  retailers: Retailer[];
  retailerId?: string;
  onEditStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onEditBranch: (branch: StoreBranch) => void;
  onDeleteBranch: (id: string) => void;
  onEditTask: (task: CrawlerTask) => void;
  onDeleteTask: (id: string) => void;
  onRunTask: (task: CrawlerTask) => void;
}

export default function StoreTableView({
  stores,
  branches,
  tasks,
  retailers,
  retailerId,
  onEditStore,
  onDeleteStore,
  onEditBranch,
  onDeleteBranch,
  onEditTask,
  onDeleteTask,
  onRunTask
}: StoreTableViewProps) {
  const [expandedStoreIds, setExpandedStoreIds] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Filter stores by retailerId if provided
  const filteredStores = retailerId 
    ? stores.filter(store => store.retailer_id === retailerId) 
    : stores;

  const toggleStoreExpand = (storeId: string) => {
    setExpandedStoreIds(prev => ({
      ...prev,
      [storeId]: !prev[storeId]
    }));
  };

  const getStoreBranches = (storeId: string) => {
    return branches.filter(branch => branch.store_id === storeId);
  };

  const getStoreTasks = (storeId: string) => {
    return tasks.filter(task => task.store_id === storeId);
  };

  const getRetailerName = (retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId);
    return retailer?.name || "Unknown";
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Store Name</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Branches</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStores.map((store) => (
            <Collapsible
              key={store.id}
              open={expandedStoreIds[store.id]}
              onOpenChange={() => toggleStoreExpand(store.id)}
              asChild
            >
              <>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleStoreExpand(store.id)}
                >
                  <TableCell>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStoreExpand(store.id);
                        }}
                      >
                        {expandedStoreIds[store.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="font-medium">{store.store_name}</TableCell>
                  <TableCell>{getRetailerName(store.retailer_id)}</TableCell>
                  <TableCell>{store.country}</TableCell>
                  <TableCell>{new Date(store.last_updated).toLocaleDateString()}</TableCell>
                  <TableCell>{getStoreBranches(store.id).length}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/tasks?storeId=${store.id}`);
                      }}
                    >
                      {getStoreTasks(store.id).length} Tasks
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStore(store);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteStore(store.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <div className="p-4 bg-muted/30">
                        <h3 className="text-md font-semibold mb-3">Branches for {store.store_name}</h3>
                        <div className="border rounded-md bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Branch ID</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getStoreBranches(store.id).map((branch) => (
                                <TableRow key={branch.id}>
                                  <TableCell className="font-medium">{branch.branch_id}</TableCell>
                                  <TableCell>
                                    {branch.street} {branch.house_number}, {branch.zip_code}
                                  </TableCell>
                                  <TableCell>{branch.city}</TableCell>
                                  <TableCell>{branch.country}</TableCell>
                                  <TableCell className="text-right space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onEditBranch(branch)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                      onClick={() => onDeleteBranch(branch.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {getStoreBranches(store.id).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                    No branches found for this store
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <h3 className="text-md font-semibold mt-6 mb-3">Crawler Tasks for {store.store_name}</h3>
                        <div className="border rounded-md bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Run</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getStoreTasks(store.id).map((task) => (
                                <TableRow key={task.id}>
                                  <TableCell>{task.scraper_type}</TableCell>
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
                              ))}
                              {getStoreTasks(store.id).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                    No crawler tasks found for this store
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
          {filteredStores.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                No stores found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
