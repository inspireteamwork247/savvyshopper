
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/services/apiClient";

// Define types for user and auth context
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuthStatus = async () => {
      try {
        // Get session from localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Validate token with the Java API
          const userData = await apiRequest<User>(
            'auth/validate', 
            'GET',
            undefined,
            { requiresAuth: true }
          );
          
          setUser(userData);
        }
      } catch (error) {
        // Clear invalid token
        console.error('Authentication error:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
