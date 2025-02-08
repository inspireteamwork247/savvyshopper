
import { motion } from "framer-motion";
import { DealInsights } from "@/components/DealInsights";

const Deals = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Deals</h1>
        <DealInsights />
      </div>
    </motion.div>
  );
};

export default Deals;
