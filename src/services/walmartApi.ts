interface WalmartAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface WalmartLocation {
  id: string;
  name: string;
  address: {
    address1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface WalmartProduct {
  itemId: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
}

class WalmartAPI {
  private static BASE_URL = 'https://marketplace.walmartapis.com/v3';
  private static clientId = ''; // You'll need to add your Walmart API client ID
  private static clientSecret = ''; // You'll need to add your Walmart API client secret
  private accessToken: string | null = null;

  private async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${WalmartAPI.BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': Date.now().toString(),
        },
        body: `grant_type=client_credentials&client_id=${WalmartAPI.clientId}&client_secret=${WalmartAPI.clientSecret}`,
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Walmart API');
      }

      const data: WalmartAuthResponse = await response.json();
      this.accessToken = data.access_token;
    } catch (error) {
      console.error('Walmart authentication error:', error);
      throw error;
    }
  }

  async getNearbyStores(zipCode: string): Promise<WalmartLocation[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${WalmartAPI.BASE_URL}/stores?zipCode=${zipCode}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby Walmart stores');
      }

      const data = await response.json();
      return data.stores;
    } catch (error) {
      console.error('Error fetching nearby Walmart stores:', error);
      throw error;
    }
  }

  async getProductPrices(storeId: string, term: string): Promise<WalmartProduct[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(
        `${WalmartAPI.BASE_URL}/stores/${storeId}/products?search=${encodeURIComponent(term)}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Walmart product prices');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching Walmart product prices:', error);
      throw error;
    }
  }
}

export const walmartApi = new WalmartAPI();