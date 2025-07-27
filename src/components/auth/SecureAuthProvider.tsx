import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { enterpriseSecurity } from '@/utils/security/enterpriseSecurity';
import { PRODUCTION_CONFIG } from '@/config/production';

interface SecureAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  validateSession: () => boolean;
  isSessionValid: boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

interface SecureAuthProviderProps {
  children: React.ReactNode;
}

export function SecureAuthProvider({ children }: SecureAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Enhanced session validation
  const validateSession = useCallback(() => {
    if (!session) {
      setIsSessionValid(false);
      return false;
    }

    // Check session expiry
    const now = Date.now() / 1000;
    if (session.expires_at && session.expires_at < now) {
      enterpriseSecurity.logSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Expired session detected',
        context: {
          userId: session.user?.id,
          sessionId: session.access_token?.substring(0, 10),
          ipAddress: 'client-side',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          riskScore: 5,
          flags: ['expired_session']
        }
      });
      setIsSessionValid(false);
      return false;
    }

    // Check activity timeout
    const activityTimeout = PRODUCTION_CONFIG.SESSION.SESSION_TIMEOUT;
    if (Date.now() - lastActivity > activityTimeout) {
      enterpriseSecurity.logSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Session timeout due to inactivity',
        context: {
          userId: session.user?.id,
          sessionId: session.access_token?.substring(0, 10),
          ipAddress: 'client-side',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          riskScore: 3,
          flags: ['session_timeout']
        }
      });
      setIsSessionValid(false);
      signOut();
      return false;
    }

    // Enhanced session validation using enterprise security
    const isValid = enterpriseSecurity.validateSession(session);
    setIsSessionValid(isValid);
    
    if (!isValid) {
      enterpriseSecurity.logSecurityEvent({
        type: 'authentication',
        severity: 'high',
        description: 'Session validation failed',
        context: {
          userId: session.user?.id,
          sessionId: session.access_token?.substring(0, 10),
          ipAddress: 'client-side',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          riskScore: 7,
          flags: ['invalid_session']
        }
      });
    }

    return isValid;
  }, [session, lastActivity]);

  // Update activity tracker
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Secure sign out with session cleanup
  const signOut = useCallback(async () => {
    try {
      // Log security event for logout
      if (session) {
        enterpriseSecurity.logSecurityEvent({
          type: 'authentication',
          severity: 'low',
          description: 'User initiated logout',
          context: {
            userId: session.user?.id,
            sessionId: session.access_token?.substring(0, 10),
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 0,
            flags: ['user_logout']
          }
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        enterpriseSecurity.logSecurityEvent({
          type: 'authentication',
          severity: 'medium',
          description: 'Error during logout process',
          context: {
            userId: session?.user?.id,
            sessionId: session?.access_token?.substring(0, 10),
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 4,
            flags: ['logout_error']
          },
          metadata: { error: error.message }
        });
        console.error('Error signing out:', error);
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setIsSessionValid(false);
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  }, [session]);

  useEffect(() => {
    // Initialize session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          enterpriseSecurity.logSecurityEvent({
            type: 'authentication',
            severity: 'medium',
            description: 'Error getting initial session',
            context: {
              userId: undefined,
              sessionId: undefined,
              ipAddress: 'client-side',
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              riskScore: 4,
              flags: ['session_error']
            },
            metadata: { error: error.message }
          });
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);

        if (initialSession) {
          enterpriseSecurity.logSecurityEvent({
            type: 'authentication',
            severity: 'low',
            description: 'Session restored from storage',
            context: {
              userId: initialSession.user?.id,
              sessionId: initialSession.access_token?.substring(0, 10),
              ipAddress: 'client-side',
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              riskScore: 1,
              flags: ['session_restored']
            }
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with enhanced security logging
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Log authentication events
        enterpriseSecurity.logSecurityEvent({
          type: 'authentication',
          severity: 'low',
          description: `Auth state changed: ${event}`,
          context: {
            userId: currentSession?.user?.id,
            sessionId: currentSession?.access_token?.substring(0, 10),
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: event === 'SIGNED_OUT' ? 0 : 1,
            flags: [event.toLowerCase()]
          },
          metadata: { authEvent: event }
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Activity monitoring
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  // Periodic session validation
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      validateSession();
    }, PRODUCTION_CONFIG.SESSION.ACTIVITY_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [session, validateSession]);

  const value: SecureAuthContextType = {
    user,
    session,
    loading,
    signOut,
    validateSession,
    isSessionValid
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
}

export function useSecureAuth(): SecureAuthContextType {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
}