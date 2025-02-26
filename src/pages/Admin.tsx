
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

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

        <TabsContent value="stores">
          Stores management coming soon...
        </TabsContent>

        <TabsContent value="branches">
          Store branches management coming soon...
        </TabsContent>

        <TabsContent value="crawlers">
          Crawler tasks management coming soon...
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
    </div>
  );
}
