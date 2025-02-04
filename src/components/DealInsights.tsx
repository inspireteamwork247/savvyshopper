import React from 'react';
import { TrendingUp, Clock, Store, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface DealPattern {
  itemName: string;
  bestDay: string;
  bestStore: string;
  averageDiscount: number;
  historicalLow: number;
  currentPrice: number;
}

const mockDealPatterns: DealPattern[] = [
  {
    itemName: "Milk (1 gallon)",
    bestDay: "Wednesday",
    bestStore: "FreshMart",
    averageDiscount: 15,
    historicalLow: 2.49,
    currentPrice: 2.99
  },
  {
    itemName: "Bread",
    bestDay: "Monday",
    bestStore: "SuperSave",
    averageDiscount: 20,
    historicalLow: 1.99,
    currentPrice: 2.49
  }
];

export const DealInsights = () => {
  const handleSaveAlert = (itemName: string, bestDay: string) => {
    toast.success(`We'll notify you when ${itemName} goes on sale next ${bestDay}!`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Deal Insights</h2>
      </div>

      <div className="space-y-4">
        {mockDealPatterns.map((pattern) => (
          <Card key={pattern.itemName} className="hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pattern.itemName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Best day to buy: <strong>{pattern.bestDay}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Store className="w-4 h-4 text-green-500" />
                  <span>Best store: <strong>{pattern.bestStore}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-purple-500" />
                  <span>Average discount: <strong>{pattern.averageDiscount}%</strong></span>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Current price: ${pattern.currentPrice.toFixed(2)} 
                  {pattern.currentPrice > pattern.historicalLow && (
                    <span className="text-orange-500 ml-2">
                      Historical low: ${pattern.historicalLow.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleSaveAlert(pattern.itemName, pattern.bestDay)}
                  className="mt-2 text-sm text-primary hover:text-primary/80 underline"
                >
                  Alert me when on sale
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};