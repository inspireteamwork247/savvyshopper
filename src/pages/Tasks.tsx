
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingList } from "@/components/ShoppingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserShoppingLists } from "@/services/shoppingListApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("current");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const { data: shoppingLists, isLoading } = useQuery({
    queryKey: ["shoppingLists"],
    queryFn: getUserShoppingLists,
    enabled: !!user,
  });

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Shopping Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current List</TabsTrigger>
              <TabsTrigger value="saved">Saved Lists</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-4">
              <ShoppingList />
            </TabsContent>
            <TabsContent value="saved" className="mt-4">
              <div className="space-y-4">
                {shoppingLists && shoppingLists.length > 0 ? (
                  shoppingLists.map((list) => (
                    <Card key={list.id}>
                      <CardHeader>
                        <CardTitle>{list.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{list.items.length} items</p>
                        <p>Created: {new Date(list.created).toLocaleDateString()}</p>
                        {list.shared && <p>Shared with {list.collaborators?.length || 0} people</p>}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No saved lists found</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
