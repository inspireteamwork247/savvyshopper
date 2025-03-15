
import { API_CONFIG } from '@/config/api';

interface ApiOptions {
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
}

const defaultOptions: ApiOptions = {
  requiresAuth: true
};

/**
 * Creates a fetch request with proper headers and error handling
 */
export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  options: ApiOptions = defaultOptions
): Promise<T> {
  const { requiresAuth = true, customHeaders = {} } = options;
  
  let headers = {
    ...API_CONFIG.HEADERS,
    ...customHeaders
  };

  if (requiresAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication required');
    }
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include'
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    // Parse error response
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If parsing fails, use status text
      errorMessage = response.statusText;
    }
    
    throw new Error(`API Error (${response.status}): ${errorMessage}`);
  }

  return response.json();
}
