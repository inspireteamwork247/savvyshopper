
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StoreRecommendation {
  store: string;
  total_price: number;
  distance_meters: number;
}

interface StoreRecommendationsProps {
  recommendations: StoreRecommendation[];
}

export const StoreRecommendations = ({ recommendations }: StoreRecommendationsProps) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">Recommended Stores</h3>
      {recommendations.map((rec, index) => (
        <Card key={index} className="animate-slideIn">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{rec.store}</span>
              <span className="text-sm text-gray-500">{formatDistance(rec.distance_meters)}</span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              Total price: ${rec.total_price.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
