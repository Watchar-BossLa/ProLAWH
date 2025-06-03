
import { createContext, useContext, ReactNode } from 'react';
import { useEnhancedAuth } from '@/hooks/auth/useEnhancedAuth';
import type { User, Session } from '@supabase/supabase-js';

interface ProductionAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  setError: (error: Error | null) => void;
}

const ProductionAuthContext = createContext<ProductionAuthContextType | undefined>(undefined);

export function useProductionAuth() {
  const context = useContext(ProductionAuthContext);
  if (!context) {
    throw new Error('useProductionAuth must be used within a ProductionAuthProvider');
  }
  return context;
}

interface ProductionAuthProviderProps {
  children: ReactNode;
}

export function ProductionAuthProvider({ children }: ProductionAuthProviderProps) {
  const {
    user,
    session,
    loading: isLoading,
    error,
    signIn,
    signUp,
    signOut,
    setError
  } = useEnhancedAuth();

  const value = {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    setError
  };

  return (
    <ProductionAuthContext.Provider value={value}>
      {children}
    </ProductionAuthContext.Provider>
  );
}
