
import { apiRequest } from './apiClient';

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_stores: string[];
  loyalty_programs: Record<string, string>;
  preferred_product_labels: string[];
  created_at: string;
  updated_at: string;
}

export const getUserPreferences = async (): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>('user/preferences');
};

export const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>('user/preferences', 'PUT', preferences);
};

export const setPreferredStores = async (stores: string[]): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>('user/preferences/stores', 'PUT', { preferred_stores: stores });
};

export const setLoyaltyPrograms = async (programs: Record<string, string>): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>('user/preferences/loyalty', 'PUT', { loyalty_programs: programs });
};

export const setPreferredLabels = async (labels: string[]): Promise<UserPreferences> => {
  return await apiRequest<UserPreferences>('user/preferences/labels', 'PUT', { preferred_product_labels: labels });
};
