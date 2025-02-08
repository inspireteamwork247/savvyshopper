
import { API_CONFIG } from '../config/api';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

class AuthAPI {
  private static BASE_URL = `${API_CONFIG.BASE_URL}/api/v1/auth`;

  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AuthAPI.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

export const authApi = new AuthAPI();
