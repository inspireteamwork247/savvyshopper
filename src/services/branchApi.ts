
import { apiRequest } from './apiClient';
import { StoreBranch } from '@/types/admin';

export const getBranches = async (): Promise<StoreBranch[]> => {
  return await apiRequest<StoreBranch[]>('branches');
};

export const getBranchesByStore = async (storeId: string): Promise<StoreBranch[]> => {
  return await apiRequest<StoreBranch[]>(`stores/${storeId}/branches`);
};

export const getBranch = async (id: string): Promise<StoreBranch> => {
  return await apiRequest<StoreBranch>(`branches/${id}`);
};

export const createBranch = async (branch: Partial<StoreBranch>): Promise<StoreBranch> => {
  return await apiRequest<StoreBranch>('branches', 'POST', branch);
};

export const updateBranch = async (id: string, branch: Partial<StoreBranch>): Promise<StoreBranch> => {
  return await apiRequest<StoreBranch>(`branches/${id}`, 'PUT', branch);
};

export const deleteBranch = async (id: string): Promise<void> => {
  return await apiRequest<void>(`branches/${id}`, 'DELETE');
};
