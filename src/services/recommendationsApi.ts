
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
    const response = await fetch('http://localhost:8080/api/recommendations/best-stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch store recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching store recommendations:', error);
    throw error;
  }
};
