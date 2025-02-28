
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Retailer, Store, CrawlerTask } from "@/types/admin";
import { useNavigate } from "react-router-dom";

interface RetailerTableViewProps {
  retailers: Retailer[];
  stores: Store[];
  tasks: CrawlerTask[];
  onEditRetailer: (retailer: Retailer) => void;
  onDeleteRetailer: (id: string) => void;
  onEditStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onEditTask: (task: CrawlerTask) => void;
  onDeleteTask: (id: string) => void;
  onRunTask: (task: CrawlerTask) => void;
}

export default function RetailerTableView({
  retailers,
  stores,
  tasks,
  onEditRetailer,
  onDeleteRetailer,
  onEditStore,
  onDeleteStore,
  onEditTask,
  onDeleteTask,
  onRunTask
}: RetailerTableViewProps) {
  const [expandedRetailerIds, setExpandedRetailerIds] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleRetailerExpand = (retailerId: string) => {
    setExpandedRetailerIds(prev => ({
      ...prev,
      [retailerId]: !prev[retailerId]
    }));
  };

  const getRetailerStores = (retailerId: string) => {
    return stores.filter(store => store.retailer_id === retailerId);
  };

  const getStoreTasks = (storeId: string) => {
    return tasks.filter(task => task.store_id === storeId);
  };

  const getRetailerTasks = (retailerId: string) => {
    const retailerStoreIds = stores
      .filter(store => store.retailer_id === retailerId)
      .map(store => store.id);

    return tasks.filter(task => retailerStoreIds.includes(task.store_id));
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Countries</TableHead>
            <TableHead>Integration Type</TableHead>
            <TableHead>Stores</TableHead>
            <TableHead>Crawler Tasks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retailers.map((retailer) => (
            <Collapsible
              key={retailer.id}
              open={expandedRetailerIds[retailer.id]}
              onOpenChange={() => toggleRetailerExpand(retailer.id)}
              asChild
            >
              <>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleRetailerExpand(retailer.id)}
                >
                  <TableCell>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRetailerExpand(retailer.id);
                        }}
                      >
                        {expandedRetailerIds[retailer.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="font-medium">{retailer.name}</TableCell>
                  <TableCell>
                    {retailer.website ? (
                      <a 
                        href={retailer.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{retailer.countries.join(", ")}</TableCell>
                  <TableCell>{retailer.integration_type}</TableCell>
                  <TableCell>{getRetailerStores(retailer.id).length}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/tasks?retailerId=${retailer.id}`);
                      }}
                    >
                      {getRetailerTasks(retailer.id).length} Tasks
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRetailer(retailer);
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
                        onDeleteRetailer(retailer.id);
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
                        <h3 className="text-md font-semibold mb-3">Stores for {retailer.name}</h3>
                        <div className="border rounded-md bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Store Name</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Related Tasks</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getRetailerStores(retailer.id).map((store) => (
                                <TableRow key={store.id}>
                                  <TableCell className="font-medium">{store.store_name}</TableCell>
                                  <TableCell>{store.country}</TableCell>
                                  <TableCell>{new Date(store.last_updated).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-500 hover:text-blue-700"
                                      onClick={() => navigate(`/admin/tasks?storeId=${store.id}`)}
                                    >
                                      {getStoreTasks(store.id).length} Tasks
                                    </Button>
                                  </TableCell>
                                  <TableCell className="text-right space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onEditStore(store)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                      onClick={() => onDeleteStore(store.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {getRetailerStores(retailer.id).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                    No stores found for this retailer
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <h3 className="text-md font-semibold mt-6 mb-3">Crawler Tasks for {retailer.name}</h3>
                        <div className="border rounded-md bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Store</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Run</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getRetailerTasks(retailer.id).map((task) => {
                                const taskStore = stores.find(s => s.id === task.store_id);
                                return (
                                  <TableRow key={task.id}>
                                    <TableCell>{taskStore?.store_name || 'Unknown'}</TableCell>
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
                                );
                              })}
                              {getRetailerTasks(retailer.id).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                    No crawler tasks found for this retailer
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
          {retailers.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                No retailers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
