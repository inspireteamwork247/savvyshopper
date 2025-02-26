import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Retailer } from "@/types/admin";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import RetailerDialog from "@/components/admin/RetailerDialog";
import StoreDialog from "@/components/admin/StoreDialog";
import StoreBranchDialog from "@/components/admin/StoreBranchDialog";
import CrawlerTaskDialog from "@/components/admin/CrawlerTaskDialog";
import { Store, StoreBranch, CrawlerTask } from "@/types/admin";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);

  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<StoreBranch | null>(null);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);

  const [tasks, setTasks] = useState<CrawlerTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<CrawlerTask | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRetailers(data);
    } catch (error: any) {
      toast.error('Failed to fetch retailers: ' + error.message);
    }
  };

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('store_name');
      
      if (error) throw error;
      setStores(data);
    } catch (error: any) {
      toast.error('Failed to fetch stores: ' + error.message);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('store_branches')
        .select('*')
        .order('city');
      
      if (error) throw error;
      setBranches(data);
    } catch (error: any) {
      toast.error('Failed to fetch branches: ' + error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('crawler_tasks')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setTasks(data);
    } catch (error: any) {
      toast.error('Failed to fetch tasks: ' + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRetailers();
      fetchStores();
      fetchBranches();
      fetchTasks();
    }
  }, [user]);

  const handleDeleteRetailer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRetailers(retailers.filter(r => r.id !== id));
      toast.success('Retailer deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete retailer: ' + error.message);
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setStores(stores.filter(s => s.id !== id));
      toast.success('Store deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete store: ' + error.message);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('store_branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setBranches(branches.filter(b => b.id !== id));
      toast.success('Branch deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete branch: ' + error.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crawler_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete task: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="retailers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="branches">Store Branches</TabsTrigger>
          <TabsTrigger value="crawlers">Crawler Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="retailers" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedRetailer(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Retailer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retailers.map((retailer) => (
              <Card key={retailer.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{retailer.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRetailer(retailer);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteRetailer(retailer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Website: {retailer.website || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Integration: {retailer.integration_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Countries: {retailer.countries.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedStore(null);
                setIsStoreDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Store
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{store.store_name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedStore(store);
                          setIsStoreDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteStore(store.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Country: {store.country}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last Updated: {new Date(store.last_updated).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedBranch(null);
                setIsBranchDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Branch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{branch.branch_id}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBranch(branch);
                          setIsBranchDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {branch.street} {branch.house_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {branch.zip_code} {branch.city}, {branch.country}
                    </p>
                    {branch.latitude && branch.longitude && (
                      <p className="text-sm text-muted-foreground">
                        Location: {branch.latitude}, {branch.longitude}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crawlers" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Task {task.id.slice(0, 8)}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsTaskDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Type: {task.scraper_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {task.status}
                    </p>
                    {task.last_run && (
                      <p className="text-sm text-muted-foreground">
                        Last Run: {new Date(task.last_run).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <RetailerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        retailer={selectedRetailer}
        onSubmit={() => {
          setIsDialogOpen(false);
          fetchRetailers();
        }}
      />

      <StoreDialog
        open={isStoreDialogOpen}
        onOpenChange={setIsStoreDialogOpen}
        store={selectedStore}
        retailers={retailers}
        onSubmit={() => {
          setIsStoreDialogOpen(false);
          fetchStores();
        }}
      />

      <StoreBranchDialog
        open={isBranchDialogOpen}
        onOpenChange={setIsBranchDialogOpen}
        branch={selectedBranch}
        stores={stores}
        onSubmit={() => {
          setIsBranchDialogOpen(false);
          fetchBranches();
        }}
      />

      <CrawlerTaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        stores={stores}
        onSubmit={() => {
          setIsTaskDialogOpen(false);
          fetchTasks();
        }}
      />
    </div>
  );
}
