
import { apiRequest } from './apiClient';

interface StoreRecommendation {
  store: string;
  total_price: number;
  distance_meters: number;
}

export interface RecommendationRequest {
  products: string[];
  latitude: number;
  longitude: number;
  labels: string[];
  // zip_code is optional now
  zip_code?: string;
}

export const getStoreRecommendations = async (request: RecommendationRequest): Promise<StoreRecommendation[]> => {
  try {
    return await apiRequest<StoreRecommendation[]>(
      'recommendations/best-stores',
      'POST',
      request
    );
  } catch (error) {
    console.error('Error fetching store recommendations:', error);
    throw error;
  }
};

// New function to get product suggestions from the API
export const getProductSuggestions = async (query: string): Promise<string[]> => {
  try {
    if (!query.trim()) return [];
    
    return await apiRequest<string[]>(
      `products/suggestions?query=${encodeURIComponent(query)}`,
      'GET'
    );
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return []; // Return empty array on error to avoid breaking the UI
  }
};
