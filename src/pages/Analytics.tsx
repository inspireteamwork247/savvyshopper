
import { motion } from "framer-motion";
import { ShoppingAnalytics } from "@/components/analytics/ShoppingAnalytics";

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <ShoppingAnalytics />
      </div>
    </motion.div>
  );
};

export default Analytics;
