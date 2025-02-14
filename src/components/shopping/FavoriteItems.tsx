
import React from 'react';
import { Heart, TrendingDown, TrendingUp, History } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PriceHistory {
  date: string;
  price: number;
}

interface FavoriteItem {
  id: string;
  name: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceHistory: PriceHistory[];
  store: string;
  lastUpdated: string;
}

interface FavoriteItemsProps {
  items: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
}

export const FavoriteItems = ({ items, onRemoveFavorite }: FavoriteItemsProps) => {
  const getPriceChangeIndicator = (current: number, history: PriceHistory[]) => {
    if (history.length < 2) return null;
    const previousPrice = history[history.length - 2].price;
    const diff = current - previousPrice;
    const percentage = ((diff / previousPrice) * 100).toFixed(1);
    
    if (diff > 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{percentage}%</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span>{Math.abs(Number(percentage))}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Favorite Items</h2>
        <Badge variant="outline">{items.length} items</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="relative">
            <button
              onClick={() => onRemoveFavorite(item.id)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500" fill="#ef4444" />
            </button>

            <CardHeader>
              <CardTitle className="text-lg capitalize">{item.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{item.store}</span>
                <span>•</span>
                <History className="w-4 h-4" />
                <span>Updated {item.lastUpdated}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Price</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${item.currentPrice.toFixed(2)}</span>
                    {getPriceChangeIndicator(item.currentPrice, item.priceHistory)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Lowest</span>
                  <span className="text-green-600">${item.lowestPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Highest</span>
                  <span className="text-red-600">${item.highestPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
