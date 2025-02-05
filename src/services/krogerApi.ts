interface KrogerAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface KrogerLocation {
  locationId: string;
  name: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface KrogerProduct {
  productId: string;
  description: string;
  price: {
    regular: number;
    promo: number;
  };
}

class KrogerAPI {
  private static BASE_URL = 'https://api.kroger.com/v1';
  private static clientId = ''; // You'll need to add your Kroger API client ID
  private accessToken: string | null = null;

  // Changed from private to public
  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${KrogerAPI.BASE_URL}/connect/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${KrogerAPI.clientId}:`)}`,
        },
        body: 'grant_type=client_credentials&scope=product.compact',
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Kroger API');
      }

      const data: KrogerAuthResponse = await response.json();
      this.accessToken = data.access_token;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async getNearbyStores(zipCode: string): Promise<KrogerLocation[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${KrogerAPI.BASE_URL}/locations?filter.zipCode.near=${zipCode}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby stores');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
      throw error;
    }
  }

  async getProductPrices(locationId: string, term: string): Promise<KrogerProduct[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${KrogerAPI.BASE_URL}/products?filter.term=${encodeURIComponent(
          term
        )}&filter.locationId=${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product prices');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching product prices:', error);
      throw error;
    }
  }
}

export const krogerApi = new KrogerAPI();