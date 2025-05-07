
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define AuthUser type
interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    [key: string]: any;
  };
}

// Define AuthContextType
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            user_metadata: data.session.user.user_metadata
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown authentication error'));
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getCurrentUser();
    
    // Set up auth state change listener - fix by removing arguments
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      console.error('Sign in error:', err);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });
      
      if (error) throw error;
      
      // In a real app, we might need to handle email verification here
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign up'));
      console.error('Sign up error:', err);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
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

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
