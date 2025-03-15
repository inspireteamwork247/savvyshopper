
import { apiRequest } from './apiClient';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface AuthCredentials {
  email: string;
  password: string;
}

// Register a new user
export const registerUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiRequest<AuthResponse>(
      'auth/register',
      'POST',
      credentials,
      { requiresAuth: false }
    );
    
    // Store the auth token
    localStorage.setItem('auth_token', response.token);
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiRequest<AuthResponse>(
      'auth/login',
      'POST',
      credentials,
      { requiresAuth: false }
    );
    
    // Store the auth token
    localStorage.setItem('auth_token', response.token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    // Call the logout endpoint
    await apiRequest<void>('auth/logout', 'POST');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear the token regardless of API response
    localStorage.removeItem('auth_token');
  }
};
