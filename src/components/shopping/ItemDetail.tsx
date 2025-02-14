
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Store, Tag, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ItemDetailProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    price: number;
    store: string;
    labels: string[];
    priceHistory: Array<{ date: string; price: number }>;
  };
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export const ItemDetail = ({ open, onClose, item, onToggleFavorite, isFavorite }: ItemDetailProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="capitalize">{item.name}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFavorite}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart className={isFavorite ? "fill-current" : ""} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>{item.store}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>${item.price.toFixed(2)}</span>
            </div>
          </div>

          {item.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.labels.map((label, index) => (
                <Badge key={index} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <h3 className="font-semibold">Price History</h3>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
