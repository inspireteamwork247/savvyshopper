
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPreferences, updateUserPreferences, UserPreferences } from "@/services/userPreferencesApi";

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

const commonLabels = [
  "Essential",
  "Urgent",
  "Optional",
  "Bulk",
  "Organic",
  "Sustainable",
  "Local",
  "Fair Trade",
  "Premium",
  "Budget",
];

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newStore, setNewStore] = useState("");
  const [newLoyaltyProgram, setNewLoyaltyProgram] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences,
    enabled: !!user,
    onError: (error) => {
      console.error('Error fetching preferences:', error);
      toast.error("Failed to load your preferences");
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      toast.success("Preferences saved successfully");
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error("Failed to save preferences");
      setIsSaving(false);
    }
  });

  const savePreferences = (updatedPrefs: Partial<UserPreferences>) => {
    if (!user) return;
    setIsSaving(true);
    updatePreferencesMutation.mutate(updatedPrefs);
  };

  const addStore = () => {
    if (!newStore.trim()) {
      toast.error("Please enter a store name");
      return;
    }
    
    if (!preferences) return;
    
    if (preferences.preferred_stores.includes(newStore.trim())) {
      toast.error("Store already added");
      return;
    }
    
    const updatedStores = [...preferences.preferred_stores, newStore.trim()];
    savePreferences({ preferred_stores: updatedStores });
    setNewStore("");
    setSelectedStore(newStore.trim());
    toast.success("Store added");
  };

  const removeStore = (store: string) => {
    if (!preferences) return;
    
    const updatedStores = preferences.preferred_stores.filter(s => s !== store);
    const updatedPrograms = { ...preferences.loyalty_programs };
    delete updatedPrograms[store];
    
    savePreferences({
      preferred_stores: updatedStores,
      loyalty_programs: updatedPrograms
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
    
    if (!preferences) return;
    
    const updatedPrograms = {
      ...preferences.loyalty_programs,
      [selectedStore]: newLoyaltyProgram.trim()
    };
    
    savePreferences({ loyalty_programs: updatedPrograms });
    setNewLoyaltyProgram("");
    toast.success("Loyalty program added");
  };

  const removeLoyaltyProgram = (store: string) => {
    if (!preferences) return;
    
    const updatedPrograms = { ...preferences.loyalty_programs };
    delete updatedPrograms[store];
    
    savePreferences({ loyalty_programs: updatedPrograms });
    toast.success("Loyalty program removed");
  };

  const toggleLabel = (label: string) => {
    if (!preferences) return;
    
    const currentLabels = preferences.preferred_product_labels;
    const updatedLabels = currentLabels.includes(label)
      ? currentLabels.filter(l => l !== label)
      : [...currentLabels, label];
    
    savePreferences({ preferred_product_labels: updatedLabels });
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || !preferences) {
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
              <Button onClick={addStore} disabled={isSaving}>
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
              <Button onClick={addLoyaltyProgram} disabled={isSaving}>
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
                    disabled={isSaving}
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
              <div className="flex flex-wrap gap-2">
                {commonLabels.map(label => (
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
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
