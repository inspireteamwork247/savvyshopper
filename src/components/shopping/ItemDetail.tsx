import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, Store, Tag, BarChart3, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subscribeToPriceAlert, unsubscribeFromPriceAlert } from '../../services/priceTrackingApi';
import { DealSocial } from '@/components/social/DealSocial';

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
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState(item.price);
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (targetPrice <= 0) {
      toast.error('Please enter a valid target price');
      return;
    }
    subscribeToPriceAlert(item.id, targetPrice, email);
    setShowAlertForm(false);
    setEmail('');
  };

  const handleUnsubscribe = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    unsubscribeFromPriceAlert(item.id, email);
    setShowAlertForm(false);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="capitalize">{item.name}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAlertForm(!showAlertForm)}
              >
                <Bell className={showAlertForm ? "text-blue-500" : ""} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart className={isFavorite ? "fill-current" : ""} />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Track this item's price and get notified when it drops.
          </DialogDescription>
        </DialogHeader>

        {showAlertForm && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">Set Price Alert</h3>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                min={0}
                step={0.01}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubscribe} className="flex-1">
                  Subscribe
                </Button>
                <Button onClick={handleUnsubscribe} variant="outline" className="flex-1">
                  Unsubscribe
                </Button>
              </div>
            </div>
          </div>
        )}

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

          <DealSocial dealId={item.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
