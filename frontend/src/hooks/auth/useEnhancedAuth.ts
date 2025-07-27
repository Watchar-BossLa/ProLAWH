
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CONFIG, ENV } from '@/config';
import { SessionService } from '@/components/security/session/services/sessionService';
import { generateDeviceId, getDeviceInfo } from '@/components/security/session/utils/deviceFingerprint';
import { handleAsyncError } from '@/utils/errorHandling';
import type { User, Session } from '@supabase/supabase-js';

export function useEnhancedAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Simplified session creation without complex tracking for now
  const createUserSession = useCallback(async (user: User) => {
    if (!user) return;
    
    try {
      console.log('Creating user session for:', user.id);
      const deviceId = generateDeviceId();
      const deviceInfo = getDeviceInfo();
      await SessionService.createSession(user.id, deviceId, deviceInfo);
      console.log('User session created successfully');
    } catch (error) {
      console.error('Error creating user session:', error);
      // Don't throw here - session tracking is optional
    }
  }, []);

  // Simplified sign in with comprehensive logging
  const signIn = async (email: string, password: string) => {
    console.log('Starting sign in process for email:', email);
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful, user:', data.user?.id);
      
      // Only create session if user exists and no errors
      if (data.user) {
        setTimeout(() => {
          createUserSession(data.user);
        }, 0);
      }

      return data;
    } catch (err) {
      console.error("Detailed sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown sign in error';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simplified sign up with comprehensive logging
  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('Starting sign up process for email:', email);
    setLoading(true);
    setError(null);
    
    try {
      // Determine redirect URL
      const redirectUrl = ENV.isProduction 
        ? `${window.location.origin}/dashboard`
        : `${window.location.origin}/dashboard`;
      
      console.log('Sign up redirect URL:', redirectUrl);
      console.log('Sign up user data:', userData);

      const signUpData = {
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          ...(userData && { data: userData })
        }
      };

      console.log('Calling supabase.auth.signUp with:', signUpData);
      
      const { data, error } = await supabase.auth.signUp(signUpData);
      
      console.log('Sign up response:', { data, error });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful');
      
      // Check if user was created (not just session)
      if (data.user) {
        console.log('User created:', data.user.id);
        if (data.session) {
          console.log('Session created immediately');
        } else {
          console.log('No immediate session - email confirmation may be required');
        }
      }

      return data;
    } catch (err) {
      console.error("Detailed sign up error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown sign up error';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simplified sign out
  const signOut = async () => {
    console.log('Starting sign out process');
    setLoading(true);
    
    try {
      // Skip in development bypass mode
      if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
        console.log('Skipping sign out in development bypass mode');
        return;
      }

      // Clean up session tracking (but don't fail if it errors)
      if (user) {
        try {
          const { data: sessions } = await SessionService.fetchSessions(user.id);
          const currentSession = sessions?.find(s => s.is_current);
          if (currentSession) {
            await SessionService.revokeSession(currentSession.id);
          }
        } catch (sessionError) {
          console.error('Error cleaning up session (non-fatal):', sessionError);
        }
      }
      
      console.log('Calling supabase.auth.signOut...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
    } catch (err) {
      console.error("Error during sign out:", err);
      throw err instanceof Error ? err : new Error('Error during sign out');
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state with comprehensive logging
  useEffect(() => {
    console.log('Initializing auth state...');
    
    // Development bypass check
    if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
      console.log('Using development bypass mode');
      setUser(CONFIG.MOCK_USER as User);
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        console.log('Getting initial session...');
        
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Initial session response:', { data, error });
        
        if (error) {
          console.error('Error getting initial session:', error);
          throw error;
        }

        setSession(data.session);
        setUser(data.session?.user || null);
        
        console.log('Initial auth state set:', {
          hasSession: !!data.session,
          hasUser: !!data.session?.user,
          userId: data.session?.user?.id
        });

        // Create session tracking for existing session (but don't fail)
        if (data.session?.user) {
          setTimeout(() => {
            createUserSession(data.session.user);
          }, 0);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener with logging
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        console.log('Auth state change session:', session);
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // Handle session creation for new logins
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, creating session tracking');
          setTimeout(() => {
            createUserSession(session.user);
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [createUserSession]);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    setError
  };
}
