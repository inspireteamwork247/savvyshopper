
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDeals, Deal } from "@/services/dealApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Percent } from "lucide-react";

export default function Deals() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: getDeals,
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (deals) {
      if (searchQuery.trim() === "") {
        setFilteredDeals(deals);
      } else {
        const query = searchQuery.toLowerCase();
        setFilteredDeals(
          deals.filter(
            (deal) =>
              deal.name.toLowerCase().includes(query) ||
              deal.store_name.toLowerCase().includes(query) ||
              deal.categories.some((category) => category.toLowerCase().includes(query))
          )
        );
      }
    }
  }, [deals, searchQuery]);

  if (loading || dealsLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Current Deals</h1>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search deals by name, store or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals && filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {deal.image_url && (
                  <img 
                    src={deal.image_url} 
                    alt={deal.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500">
                    <Percent className="h-3 w-3 mr-1" />
                    {deal.discount_percentage}% OFF
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle>{deal.name}</CardTitle>
                <div className="text-sm text-gray-500">{deal.store_name}</div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold text-primary">${deal.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${deal.regular_price.toFixed(2)}
                    </span>
                  </div>
                  <Button size="sm" className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                <div className="text-sm">
                  Valid until: {new Date(deal.valid_to).toLocaleDateString()}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {deal.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No deals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
