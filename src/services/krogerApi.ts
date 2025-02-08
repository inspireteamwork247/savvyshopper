
import { API_CONFIG } from '../config/api';

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
  private static BASE_URL = API_CONFIG.BASE_URL;
  private static clientId = 'savvy-shopper-2432612430342447666431504b5834686d77766b4c30656c5a3938532e676736446a6d486875766b59376f6c4e726b4f4d43384730334277683859712322802588174647286';
  private accessToken: string | null = 'kHIg76hlb1y-_38eNgaR-YHQpdAvPOuBIzFvoaoa';

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
