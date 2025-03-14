
import { apiRequest } from './apiClient';

interface PriceAlert {
  id: string;
  item_id: string;
  email: string;
  target_price: number;
  created_at: string;
}

export const subscribeToPriceAlert = async (
  itemId: string, 
  targetPrice: number, 
  email: string
): Promise<PriceAlert> => {
  return await apiRequest<PriceAlert>('price-alerts', 'POST', {
    item_id: itemId,
    target_price: targetPrice,
    email
  });
};

export const unsubscribeFromPriceAlert = async (
  itemId: string, 
  email: string
): Promise<void> => {
  return await apiRequest<void>(`price-alerts/unsubscribe`, 'POST', {
    item_id: itemId,
    email
  });
};

export const getPriceAlerts = async (email: string): Promise<PriceAlert[]> => {
  return await apiRequest<PriceAlert[]>(`price-alerts?email=${encodeURIComponent(email)}`);
};

export const getPriceHistory = async (itemId: string): Promise<Array<{ date: string; price: number }>> => {
  return await apiRequest<Array<{ date: string; price: number }>>(`items/${itemId}/price-history`);
};
