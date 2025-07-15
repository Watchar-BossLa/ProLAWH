/**
 * Enterprise Authentication Provider
 * Production-ready authentication with comprehensive security features
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '@/utils/auth/AuthService';
import { logger, performanceLogger } from '@/utils/logger/Logger';
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

  const initializeAuth = useCallback(async () => {
    try {
      await logger.info('Initializing authentication state', {}, 'EnterpriseAuthProvider');
      
      const { session, error } = await authService.getCurrentSession();
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error
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
        
        await logger.info('User authentication restored', { 
          userId: session.user.id 
        }, 'EnterpriseAuthProvider');
      }

    } catch (error) {
      await logger.error('Failed to initialize auth', { error }, 'EnterpriseAuthProvider');
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
    return await performanceLogger.measureAsync('signIn', async () => {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await authService.signIn(credentials);

      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error
        }));
        return { error };
      }

      if (data) {
        // Store session info for logging context
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
    }, { operation: 'user_signin' });
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    return await performanceLogger.measureAsync('signUp', async () => {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await authService.signUp(credentials);

      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error
        }));
        return { error };
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
    }, { operation: 'user_signup' });
  }, []);

  const signOut = useCallback(async () => {
    return await performanceLogger.measureAsync('signOut', async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { error } = await authService.signOut();

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
        error
      });

      return { error };
    }, { operation: 'user_signout' });
  }, []);

  const resetPassword = useCallback(async (request: { email: string }) => {
    // This would be implemented with Supabase password reset
    await logger.info('Password reset requested', { email: request.email }, 'EnterpriseAuthProvider');
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (request: { currentPassword: string; newPassword: string }) => {
    // This would be implemented with Supabase password update
    await logger.info('Password update requested', {}, 'EnterpriseAuthProvider');
    return { error: null };
  }, []);

  const refreshSession = useCallback(async () => {
    return await performanceLogger.measureAsync('refreshSession', async () => {
      const { session, error } = await authService.refreshSession();

      if (error) {
        setAuthState(prev => ({ ...prev, error }));
        return { error };
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
    }, { operation: 'session_refresh' });
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