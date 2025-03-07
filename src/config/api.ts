
export const API_CONFIG = {
  BASE_URL: import.meta.env.MODE === 'production' 
    ? 'https://api.inspirecreations.it.com/api/v1/savvyshopper'
    : 'http://localhost:8080/api/v1/savvyshopper',
  HEADERS: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'savvyshopper'
  }
};
