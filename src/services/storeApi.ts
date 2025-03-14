
import { apiRequest } from './apiClient';
import { Store } from '@/types/admin';

export const getStores = async (): Promise<Store[]> => {
  return await apiRequest<Store[]>('stores');
};

export const getStoresByRetailer = async (retailerId: string): Promise<Store[]> => {
  return await apiRequest<Store[]>(`retailers/${retailerId}/stores`);
};

export const getStore = async (id: string): Promise<Store> => {
  return await apiRequest<Store>(`stores/${id}`);
};

export const createStore = async (store: Partial<Store>): Promise<Store> => {
  return await apiRequest<Store>('stores', 'POST', store);
};

export const updateStore = async (id: string, store: Partial<Store>): Promise<Store> => {
  return await apiRequest<Store>(`stores/${id}`, 'PUT', store);
};

export const deleteStore = async (id: string): Promise<void> => {
  return await apiRequest<void>(`stores/${id}`, 'DELETE');
};
