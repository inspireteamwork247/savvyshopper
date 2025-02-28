
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Retailer } from "@/types/admin";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import RetailerDialog from "@/components/admin/RetailerDialog";
import StoreDialog from "@/components/admin/StoreDialog";
import StoreBranchDialog from "@/components/admin/StoreBranchDialog";
import CrawlerTaskDialog from "@/components/admin/CrawlerTaskDialog";
import { Store, StoreBranch, CrawlerTask } from "@/types/admin";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Dashboard from "@/components/admin/Dashboard";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Data states
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [tasks, setTasks] = useState<CrawlerTask[]>([]);
  
  // Selected item states
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<StoreBranch | null>(null);
  const [selectedTask, setSelectedTask] = useState<CrawlerTask | null>(null);
  
  // Dialog open states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Filter states
  const [retailerFilter, setRetailerFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Loading states
  const [isRetailersLoading, setIsRetailersLoading] = useState(false);
  const [isStoresLoading, setIsStoresLoading] = useState(false);
  const [isBranchesLoading, setIsBranchesLoading] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRetailers();
      fetchStores();
      fetchBranches();
      fetchTasks();
    }
  }, [user]);

  const fetchRetailers = async () => {
    try {
      setIsRetailersLoading(true);
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRetailers(data);
    } catch (error: any) {
      toast.error('Failed to fetch retailers: ' + error.message);
    } finally {
      setIsRetailersLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setIsStoresLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('store_name');
      
      if (error) throw error;
      setStores(data);
    } catch (error: any) {
      toast.error('Failed to fetch stores: ' + error.message);
    } finally {
      setIsStoresLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setIsBranchesLoading(true);
      const { data, error } = await supabase
        .from('store_branches')
        .select('*')
        .order('city');
      
      if (error) throw error;
      setBranches(data);
    } catch (error: any) {
      toast.error('Failed to fetch branches: ' + error.message);
    } finally {
      setIsBranchesLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setIsTasksLoading(true);
      const { data, error } = await supabase
        .from('crawler_tasks')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setTasks(data);
    } catch (error: any) {
      toast.error('Failed to fetch tasks: ' + error.message);
    } finally {
      setIsTasksLoading(false);
    }
  };

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

  // Filtering functions
  const filteredRetailers = retailers.filter(retailer => 
    retailer.name.toLowerCase().includes(retailerFilter.toLowerCase())
  );

  const filteredStores = stores.filter(store => 
    store.store_name.toLowerCase().includes(storeFilter.toLowerCase())
  );

  const filteredBranches = branches.filter(branch => 
    branch.city.toLowerCase().includes(branchFilter.toLowerCase()) ||
    branch.country.toLowerCase().includes(branchFilter.toLowerCase())
  );

  const filteredTasks = tasks.filter(task => 
    task.scraper_type.toLowerCase().includes(taskFilter.toLowerCase()) ||
    task.status.toLowerCase().includes(taskFilter.toLowerCase())
  );

  // Pagination logic
  const paginateData = <T,>(data: T[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedRetailers = paginateData(filteredRetailers, currentPage, itemsPerPage);
  const paginatedStores = paginateData(filteredStores, currentPage, itemsPerPage);
  const paginatedBranches = paginateData(filteredBranches, currentPage, itemsPerPage);
  const paginatedTasks = paginateData(filteredTasks, currentPage, itemsPerPage);

  const pageCount = (dataLength: number) => Math.ceil(dataLength / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = (dataLength: number) => {
    const totalPages = pageCount(dataLength);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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
        <div className="flex items-center gap-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="9">9 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs 
        defaultValue="dashboard" 
        className="space-y-4"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
        }}
      >
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="branches">Store Branches</TabsTrigger>
          <TabsTrigger value="crawlers">Crawler Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Dashboard
            retailers={retailers}
            stores={stores}
            branches={branches}
            tasks={tasks}
          />
        </TabsContent>

        <TabsContent value="retailers" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter retailers..."
                className="pl-8"
                value={retailerFilter}
                onChange={(e) => {
                  setRetailerFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchRetailers}
                disabled={isRetailersLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isRetailersLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => {
                  setSelectedRetailer(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Retailer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRetailers.map((retailer) => (
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

          {renderPagination(filteredRetailers.length)}
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter stores..."
                className="pl-8"
                value={storeFilter}
                onChange={(e) => {
                  setStoreFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchStores}
                disabled={isStoresLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isStoresLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => {
                  setSelectedStore(null);
                  setIsStoreDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Store
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedStores.map((store) => (
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
                    <p className="text-sm text-muted-foreground">
                      Retailer: {retailers.find(r => r.id === store.retailer_id)?.name || 'Unknown'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {renderPagination(filteredStores.length)}
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter branches (city, country)..."
                className="pl-8"
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchBranches}
                disabled={isBranchesLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isBranchesLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => {
                  setSelectedBranch(null);
                  setIsBranchDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Branch
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBranches.map((branch) => (
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
                    <p className="text-sm text-muted-foreground">
                      Store: {stores.find(s => s.id === branch.store_id)?.store_name || 'Unknown'}
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

          {renderPagination(filteredBranches.length)}
        </TabsContent>

        <TabsContent value="crawlers" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter tasks (type, status)..."
                className="pl-8"
                value={taskFilter}
                onChange={(e) => {
                  setTaskFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchTasks}
                disabled={isTasksLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isTasksLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTasks.map((task) => (
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
                      Status: <span className={
                        task.status === 'SUCCESS' ? 'text-green-500' :
                        task.status === 'FAILURE' ? 'text-red-500' :
                        task.status === 'RUNNING' ? 'text-blue-500' : ''
                      }>{task.status}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Store: {stores.find(s => s.id === task.store_id)?.store_name || 'Unknown'}
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

          {renderPagination(filteredTasks.length)}
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
