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

        // Check for existing session from localStorage
        const savedUser = localStorage.getItem('prolawh_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // For development/demo purposes
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        email: credentials.email,
        user_metadata: {
          full_name: 'Demo User'
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('prolawh_user', JSON.stringify(mockUser));
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
      // For development/demo purposes
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        email: credentials.email,
        user_metadata: {
          full_name: credentials.fullName || 'Demo User'
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('prolawh_user', JSON.stringify(mockUser));
      setIsLoading(false);
    } catch (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('prolawh_user');
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