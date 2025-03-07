
import { apiRequest } from './apiClient';
import { supabase } from '@/lib/supabase';

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
    // First register with our Java API
    const apiResponse = await apiRequest<AuthResponse>(
      'auth/register',
      'POST',
      credentials,
      { requiresAuth: false }
    );
    
    // Then sign up with Supabase for client-side auth
    await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    
    return apiResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  try {
    // First login with our Java API
    const apiResponse = await apiRequest<AuthResponse>(
      'auth/login',
      'POST',
      credentials,
      { requiresAuth: false }
    );
    
    // Then sign in with Supabase for client-side auth
    await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    return apiResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    // Logout from our Java API
    await apiRequest<void>('auth/logout', 'POST');
    
    // Then sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
