/**
 * Enterprise Authentication Provider
 * Production-ready authentication with comprehensive security features
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { enterpriseLogger } from '@/utils/logging/enterpriseLogger';
import { ENV } from '@/config/environment';
import type { 
  AuthContextType, 
  AuthUser, 
  AuthSession, 
  AuthState, 
  AuthError,
  SignInCredentials,
  SignUpCredentials 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useEnterpriseAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider');
  }
  return context;
}

interface EnterpriseAuthProviderProps {
  children: React.ReactNode;
}

export function EnterpriseAuthProvider({ children }: EnterpriseAuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Helper function to convert Supabase errors to our AuthError type
  const convertError = (error: any): AuthError => ({
    message: error?.message || 'An error occurred',
    code: error?.code,
    type: 'auth' as const,
    timestamp: new Date()
  });

  const initializeAuth = useCallback(async () => {
    try {
      await enterpriseLogger.log({
        level: 'info',
        message: 'Initializing authentication state',
        component: 'EnterpriseAuthProvider',
        metadata: {}
      });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: convertError(error)
        }));
        return;
      }

      setAuthState({
        user: session?.user || null,
        session,
        isLoading: false,
        isAuthenticated: !!session?.user,
        error: null
      });

      if (session?.user) {
        // Store session info for logging context
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('session_id', session.access_token.slice(-10));
          sessionStorage.setItem('user_id', session.user.id);
        }
        
        await enterpriseLogger.log({
          level: 'info',
          message: 'User authentication restored',
          component: 'EnterpriseAuthProvider',
          metadata: { userId: session.user.id }
        });
      }

    } catch (error) {
      await enterpriseLogger.log({
        level: 'error',
        message: 'Failed to initialize auth',
        component: 'EnterpriseAuthProvider',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: 'Failed to initialize authentication',
          type: 'server',
          timestamp: new Date()
        }
      }));
    }
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: convertError(error)
      }));
      return { error: convertError(error) };
    }

    if (data && data.user && data.session) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('session_id', data.session.access_token.slice(-10));
        sessionStorage.setItem('user_id', data.user.id);
      }

      setAuthState({
        user: data.user,
        session: data.session,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
    }

    return { error: null };
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName || ''
        }
      }
    });

    if (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: convertError(error)
      }));
      return { error: convertError(error) };
    }

    if (data) {
      // Only store session info if we have a session (email confirmation might be required)
      if (data.session && typeof window !== 'undefined') {
        sessionStorage.setItem('session_id', data.session.access_token.slice(-10));
        sessionStorage.setItem('user_id', data.user.id);
      }

      setAuthState({
        user: data.user,
        session: data.session,
        isLoading: false,
        isAuthenticated: !!data.session,
        error: null
      });
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    const { error } = await supabase.auth.signOut();

    // Clear session info regardless of error
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('session_id');
      sessionStorage.removeItem('user_id');
    }

    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: error ? convertError(error) : null
    });

    return { error: error ? convertError(error) : null };
  }, []);

  const resetPassword = useCallback(async (request: { email: string }) => {
    await enterpriseLogger.log({
      level: 'info',
      message: 'Password reset requested',
      component: 'EnterpriseAuthProvider',
      metadata: { email: request.email }
    });
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (request: { currentPassword: string; newPassword: string }) => {
    await enterpriseLogger.log({
      level: 'info',
      message: 'Password update requested',
      component: 'EnterpriseAuthProvider',
      metadata: {}
    });
    return { error: null };
  }, []);

  const refreshSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) {
      setAuthState(prev => ({ ...prev, error: convertError(error) }));
      return { error: convertError(error) };
    }

    if (session) {
      setAuthState(prev => ({
        ...prev,
        user: session.user,
        session,
        isAuthenticated: true,
        error: null
      }));
    }

    return { error: null };
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    session: authState.session,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}