import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG, ENV } from '@/config';
import apiClient from '@/services/api';
import wsManager from '@/services/websocket';

interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string; fullName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication
    const initAuth = async () => {
      try {
        // In development mode with bypass enabled, auto-authenticate
        if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
          setUser(CONFIG.MOCK_USER as AuthUser);
          setIsLoading(false);
          return;
        }

        // Check for existing token
        const savedToken = localStorage.getItem('prolawh_token');
        if (savedToken) {
          // Verify token with backend
          apiClient.setToken(savedToken);
          const response = await apiClient.getCurrentUser();
          
          if (response.data) {
            setUser(response.data);
            // Initialize WebSocket connection
            wsManager.updateToken(savedToken);
          } else {
            // Token invalid, clear it
            apiClient.removeToken();
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiClient.removeToken();
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.access_token && response.data?.user) {
        // Set token in API client
        apiClient.setToken(response.data.access_token);
        
        // Update WebSocket with new token
        wsManager.updateToken(response.data.access_token);
        
        // Set user
        setUser(response.data.user);
        localStorage.setItem('prolawh_user', JSON.stringify(response.data.user));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (credentials: { email: string; password: string; fullName?: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.register(
        credentials.email, 
        credentials.password, 
        credentials.fullName || 'Demo User'
      );
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.access_token && response.data?.user) {
        // Set token in API client
        apiClient.setToken(response.data.access_token);
        
        // Update WebSocket with new token
        wsManager.updateToken(response.data.access_token);
        
        // Set user
        setUser(response.data.user);
        localStorage.setItem('prolawh_user', JSON.stringify(response.data.user));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    // Clear API client token
    apiClient.removeToken();
    
    // Disconnect WebSocket
    wsManager.disconnect();
    
    // Clear user state
    setUser(null);
    localStorage.removeItem('prolawh_user');
    localStorage.removeItem('prolawh_token');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}