
import { apiRequest } from './apiClient';

export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  regular_price: number;
  discount_percentage: number;
  store_id: string;
  store_name: string;
  image_url?: string;
  valid_from: string;
  valid_to: string;
  categories: string[];
  created_at: string;
}

export const getDeals = async (): Promise<Deal[]> => {
  return await apiRequest<Deal[]>('deals');
};

export const getFeaturedDeals = async (): Promise<Deal[]> => {
  return await apiRequest<Deal[]>('deals/featured');
};

export const getDealsByCategory = async (category: string): Promise<Deal[]> => {
  return await apiRequest<Deal[]>(`deals/category/${category}`);
};

export const getDealsByStore = async (storeId: string): Promise<Deal[]> => {
  return await apiRequest<Deal[]>(`stores/${storeId}/deals`);
};

export const getDeal = async (id: string): Promise<Deal> => {
  return await apiRequest<Deal>(`deals/${id}`);
};

export const searchDeals = async (query: string): Promise<Deal[]> => {
  return await apiRequest<Deal[]>(`deals/search?q=${encodeURIComponent(query)}`);
};
