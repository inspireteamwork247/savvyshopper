import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StoreRecommendation {
  storeName: string;
  items: string[];
  totalSavings: number;
  distance: string;
}

interface StoreRecommendationsProps {
  recommendations: StoreRecommendation[];
}

export const StoreRecommendations = ({ recommendations }: StoreRecommendationsProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">Recommended Stores</h3>
      {recommendations.map((rec, index) => (
        <Card key={index} className="animate-slideIn">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{rec.storeName}</span>
              <span className="text-sm text-gray-500">{rec.distance}</span>
            </div>
            <div className="text-sm text-gray-600">
              Items: {rec.items.join(", ")}
            </div>
            <div className="text-sm text-green-600 mt-1">
              Estimated savings: ${rec.totalSavings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};