
import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, Store, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { apiRequest } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

interface DealPattern {
  itemId: string;
  itemName: string;
  bestDay: string;
  bestStore: string;
  averageDiscount: number;
  historicalLow: number;
  currentPrice: number;
}

export const DealInsights = () => {
  const { data: dealPatterns = [], isLoading } = useQuery({
    queryKey: ['dealInsights'],
    queryFn: async () => {
      try {
        const response = await apiRequest<DealPattern[] | { data: DealPattern[] }>('deals/insights');
        // Handle both array response and object with data property
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        // If response format doesn't match expected, return empty array
        console.error('Unexpected response format:', response);
        return [];
      } catch (error) {
        console.error("Failed to fetch deal insights:", error);
        toast.error("Failed to load deal insights. Please try again later.");
        return [];
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error in deal insights query:", error);
        toast.error("Failed to load deal insights. Please try again later.");
      }
    }
  });

  const handleSaveAlert = async (itemId: string, itemName: string, bestDay: string) => {
    try {
      await apiRequest('deals/alerts', 'POST', {
        item_id: itemId,
        notification_day: bestDay
      });
      toast.success(`We'll notify you when ${itemName} goes on sale next ${bestDay}!`);
    } catch (error) {
      console.error("Failed to save deal alert:", error);
      toast.error("Failed to set up alert. Please try again later.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Deal Insights</h2>
        </div>
        <p className="text-center py-4">Loading deal insights...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Deal Insights</h2>
      </div>

      <div className="space-y-4">
        {dealPatterns && dealPatterns.length > 0 ? (
          dealPatterns.map((pattern) => (
            <Card key={pattern.itemId} className="hover:border-primary transition-colors">
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
                    onClick={() => handleSaveAlert(pattern.itemId, pattern.itemName, pattern.bestDay)}
                    className="mt-2 text-sm text-primary hover:text-primary/80 underline"
                  >
                    Alert me when on sale
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center py-4 text-gray-500">No deal insights available at the moment.</p>
        )}
      </div>
    </div>
  );
};
