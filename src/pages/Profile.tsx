import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { labelCategories } from "@/components/shopping/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserPreferences {
  preferred_stores: string[];
  loyalty_programs: Record<string, string>;
  preferred_product_labels: string[];
}

const commonStores = [
  "Lidl",
  "Rewe",
  "Edeka",
  "Aldi",
  "Kaufland",
  "Penny",
  "Netto",
  "Real",
];

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      preferred_stores: [],
      loyalty_programs: {},
      preferred_product_labels: [],
    };
  });

  const [newStore, setNewStore] = useState("");
  const [newLoyaltyProgram, setNewLoyaltyProgram] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const addStore = () => {
    if (!newStore.trim()) {
      toast.error("Please enter a store name");
      return;
    }
    if (preferences.preferred_stores.includes(newStore.trim())) {
      toast.error("Store already added");
      return;
    }
    setPreferences(prev => ({
      ...prev,
      preferred_stores: [...prev.preferred_stores, newStore.trim()]
    }));
    setNewStore("");
    setSelectedStore(newStore.trim());
    toast.success("Store added");
  };

  const removeStore = (store: string) => {
    setPreferences(prev => {
      const { [store]: _, ...remainingPrograms } = prev.loyalty_programs;
      return {
        ...prev,
        preferred_stores: prev.preferred_stores.filter(s => s !== store),
        loyalty_programs: remainingPrograms
      };
    });
    toast.success("Store removed");
  };

  const addLoyaltyProgram = () => {
    if (!selectedStore) {
      toast.error("Please select a store first");
      return;
    }
    if (!newLoyaltyProgram.trim()) {
      toast.error("Please enter a loyalty program name");
      return;
    }
    setPreferences(prev => ({
      ...prev,
      loyalty_programs: {
        ...prev.loyalty_programs,
        [selectedStore]: newLoyaltyProgram.trim()
      }
    }));
    setNewLoyaltyProgram("");
    toast.success("Loyalty program added");
  };

  const removeLoyaltyProgram = (store: string) => {
    setPreferences(prev => {
      const { [store]: _, ...remainingPrograms } = prev.loyalty_programs;
      return {
        ...prev,
        loyalty_programs: remainingPrograms
      };
    });
    toast.success("Loyalty program removed");
  };

  const toggleLabel = (label: string) => {
    setPreferences(prev => {
      const labels = prev.preferred_product_labels;
      return {
        ...prev,
        preferred_product_labels: labels.includes(label)
          ? labels.filter(l => l !== label)
          : [...labels, label]
      };
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Preferences</h1>
          <Button variant="destructive" onClick={async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              navigate("/auth");
              toast.success("Successfully logged out!");
            } catch (error: any) {
              toast.error(error.message);
            }
          }}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Stores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter store name"
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                list="store-suggestions"
              />
              <Button onClick={addStore}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <datalist id="store-suggestions">
              {commonStores.map(store => (
                <option key={store} value={store} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2">
              {preferences.preferred_stores.map(store => (
                <Badge
                  key={store}
                  variant="secondary"
                  className="flex items-center gap-1 text-sm"
                >
                  {store}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeStore(store)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Programs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="">Select a store</option>
                {preferences.preferred_stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
              <Input
                placeholder="Enter loyalty program"
                value={newLoyaltyProgram}
                onChange={(e) => setNewLoyaltyProgram(e.target.value)}
              />
              <Button onClick={addLoyaltyProgram}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {Object.entries(preferences.loyalty_programs).map(([store, program]) => (
                <div key={store} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{store}</span>
                    <span className="mx-2">-</span>
                    <span className="text-gray-600">{program}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLoyaltyProgram(store)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Product Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(labelCategories).map(([category, labels]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {labels.map(label => (
                      <Badge
                        key={label}
                        variant={preferences.preferred_product_labels.includes(label) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
