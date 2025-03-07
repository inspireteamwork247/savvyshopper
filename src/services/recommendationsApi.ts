
import { apiRequest } from './apiClient';

interface StoreRecommendation {
  store: string;
  total_price: number;
  distance_meters: number;
}

interface RecommendationRequest {
  products: string[];
  zip_code: string;
  latitude: number;
  longitude: number;
  labels: string[];
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
