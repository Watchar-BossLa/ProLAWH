
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

  // Enhanced session creation
  const createUserSession = useCallback(async (user: User) => {
    if (!user) return;

    const deviceId = generateDeviceId();
    const deviceInfo = getDeviceInfo();

    await SessionService.createSession(user.id, deviceId, deviceInfo);
  }, []);

  // Enhanced sign in with session tracking
  const signIn = async (email: string, password: string) => {
    try {
      const redirectUrl = ENV.isProduction 
        ? `${window.location.origin}/dashboard`
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      // Create session tracking
      if (data.user) {
        await createUserSession(data.user);
      }

      return data;
    } catch (err) {
      console.error("Error during sign in:", err);
      throw err instanceof Error ? err : new Error('Error during sign in');
    }
  };

  // Enhanced sign up with proper redirect
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = ENV.isProduction 
        ? `${window.location.origin}/dashboard`
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error during sign up:", err);
      throw err instanceof Error ? err : new Error('Error during sign up');
    }
  };

  // Enhanced sign out with session cleanup
  const signOut = async () => {
    try {
      // Skip in development bypass mode
      if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
        return;
      }

      // Clean up session tracking
      if (user) {
        // Get current session to clean up
        const { data: sessions } = await SessionService.fetchSessions(user.id);
        const currentSession = sessions?.find(s => s.is_current);
        if (currentSession) {
          await SessionService.revokeSession(currentSession.id);
        }
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (err) {
      console.error("Error during sign out:", err);
      throw err instanceof Error ? err : new Error('Error during sign out');
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Development bypass check
    if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
      setUser(CONFIG.MOCK_USER as User);
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setSession(data.session);
        setUser(data.session?.user || null);

        // Create session tracking for existing session
        if (data.session?.user) {
          await createUserSession(data.session.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error("Error getting auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // Handle session creation for new logins
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to avoid potential callback issues
          setTimeout(() => {
            createUserSession(session.user);
          }, 0);
        }
      }
    );

    return () => {
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
