
import React, { useState } from "react";
import { motion } from "framer-motion";
import { DealInsights } from "@/components/DealInsights";
import { ItemDetail } from "@/components/shopping/ItemDetail";
import { getFavorites, toggleFavorite, isFavorite } from "@/services/priceTrackingApi";

const Deals = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Example mock data - in a real app, this would come from your backend
  const mockDeals = [
    {
      id: "1",
      name: "Milk (1 gallon)",
      price: 2.99,
      store: "FreshMart",
      labels: ["Dairy", "Essential"],
      priceHistory: [
        { date: "2024-01-01", price: 3.49 },
        { date: "2024-02-01", price: 3.29 },
        { date: "2024-03-01", price: 2.99 },
      ]
    },
    {
      id: "2",
      name: "Bread",
      price: 2.49,
      store: "SuperSave",
      labels: ["Bakery", "Essential"],
      priceHistory: [
        { date: "2024-01-01", price: 2.99 },
        { date: "2024-02-01", price: 2.79 },
        { date: "2024-03-01", price: 2.49 },
      ]
    }
  ];

  const handleToggleFavorite = () => {
    if (selectedItem) {
      toggleFavorite(selectedItem.id, selectedItem.name, selectedItem.price, selectedItem.store);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Deals</h1>
        
        {/* List of deals */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {mockDeals.map((deal) => (
            <div 
              key={deal.id}
              onClick={() => setSelectedItem(deal)}
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{deal.name}</h3>
              <p className="text-green-600 font-medium">${deal.price.toFixed(2)}</p>
              <p className="text-gray-600">{deal.store}</p>
            </div>
          ))}
        </div>

        <DealInsights />

        {selectedItem && (
          <ItemDetail
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            item={selectedItem}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite(selectedItem.id)}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Deals;
