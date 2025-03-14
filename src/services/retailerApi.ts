
import { apiRequest } from './apiClient';
import { Retailer } from '@/types/admin';

export const getRetailers = async (): Promise<Retailer[]> => {
  return await apiRequest<Retailer[]>('retailers');
};

export const getRetailer = async (id: string): Promise<Retailer> => {
  return await apiRequest<Retailer>(`retailers/${id}`);
};

export const createRetailer = async (retailer: Partial<Retailer>): Promise<Retailer> => {
  return await apiRequest<Retailer>('retailers', 'POST', retailer);
};

export const updateRetailer = async (id: string, retailer: Partial<Retailer>): Promise<Retailer> => {
  return await apiRequest<Retailer>(`retailers/${id}`, 'PUT', retailer);
};

export const deleteRetailer = async (id: string): Promise<void> => {
  return await apiRequest<void>(`retailers/${id}`, 'DELETE');
};
