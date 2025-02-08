
import { ShoppingList } from "@/components/ShoppingList";
import { StoreComparison } from "@/components/StoreComparison";
import { DealInsights } from "@/components/DealInsights";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Shopping Assistant
          </h1>
          <p className="text-gray-600">
            Compare prices and find the best deals at your local stores
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <ShoppingList />
          <StoreComparison itemName="Milk (1 gallon)" stores={[
            { storeName: "FreshMart", price: 2.99, distance: "0.5 miles" },
            { storeName: "SuperSave", price: 3.49, distance: "1.2 miles" },
            { storeName: "MegaMarket", price: 2.79, distance: "2.0 miles" },
          ]} />
          <DealInsights />
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
