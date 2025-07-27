/**
 * Enterprise Authentication Service
 * Centralized authentication with comprehensive security features
 */

import { supabase } from '@/integrations/supabase/client';
import { enterpriseLogger } from '@/utils/logging/enterpriseLogger';
import { ENV, SECURITY_CONFIG } from '@/config/environment';
import type { 
  AuthUser, 
  AuthSession, 
  AuthError, 
  SignInCredentials, 
  SignUpCredentials,
  SessionInfo,
  LoginAttempt,
  SecurityEvent
} from '@/types/auth';

class AuthenticationService {
  private static instance: AuthenticationService;
  private loginAttempts: Map<string, number> = new Map();
  private lockedAccounts: Set<string> = new Set();

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  private constructor() {
    this.initializeSecurityMonitoring();
  }

  private initializeSecurityMonitoring(): void {
    // Clear login attempt counters every hour
    setInterval(() => {
      this.loginAttempts.clear();
      this.lockedAccounts.clear();
    }, 60 * 60 * 1000);
  }

  private createAuthError(message: string, code?: string, type: AuthError['type'] = 'auth'): AuthError {
    return {
      message,
      code,
      type,
      timestamp: new Date()
    };
  }

  private async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...event
      };

      await enterpriseLogger.log({
        level: 'info',
        message: 'Security event logged',
        component: 'AuthService',
        metadata: {
          eventType: event.eventType,
          riskLevel: event.riskLevel,
          userId: event.userId
        }
      });

      // Store in database for audit trail
      await supabase.from('application_logs').insert({
        level: 'info',
        message: `Security event: ${event.eventType}`,
        metadata: {
          eventType: event.eventType,
          description: event.description,
          riskLevel: event.riskLevel,
          ...event.metadata
        },
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        user_id: event.userId,
        session_id: event.sessionId,
        component: 'AuthService'
      });
    } catch (error) {
      await enterpriseLogger.log({
        level: 'error',
        message: 'Failed to log security event',
        component: 'AuthService',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  private getRiskScore(riskLevel: SecurityEvent['riskLevel']): number {
    const scores = { low: 1, medium: 5, high: 8, critical: 10 };
    return scores[riskLevel];
  }

  private getClientInfo(): { ipAddress: string; userAgent: string } {
    return {
      ipAddress: 'client-side', // In a real app, this would come from server
      userAgent: navigator.userAgent
    };
  }

  private isAccountLocked(email: string): boolean {
    return this.lockedAccounts.has(email);
  }

  private incrementLoginAttempts(email: string): void {
    const attempts = (this.loginAttempts.get(email) || 0) + 1;
    this.loginAttempts.set(email, attempts);

    if (attempts >= ENV.MAX_LOGIN_ATTEMPTS) {
      this.lockedAccounts.add(email);
    }
  }

  private resetLoginAttempts(email: string): void {
    this.loginAttempts.delete(email);
    this.lockedAccounts.delete(email);
  }

  async signIn(credentials: SignInCredentials): Promise<{ data?: { user: AuthUser; session: AuthSession }; error: AuthError | null }> {
    const startTime = performance.now();
    const { ipAddress, userAgent } = this.getClientInfo();

    try {
      await enterpriseLogger.log({
        level: 'info',
        message: 'Sign in attempt started',
        component: 'AuthService',
        metadata: { email: credentials.email }
      });

      // Check if account is locked
      if (this.isAccountLocked(credentials.email)) {
        const error = this.createAuthError(
          'Account temporarily locked due to multiple failed login attempts. Please try again later.',
          'ACCOUNT_LOCKED'
        );

        await this.logSecurityEvent({
          eventType: 'login',
          description: 'Login attempt on locked account',
          ipAddress,
          userAgent,
          riskLevel: 'high',
          metadata: { email: credentials.email, reason: 'account_locked' }
        });

        return { error };
      }

      // Attempt authentication
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (supabaseError) {
        this.incrementLoginAttempts(credentials.email);

        const error = this.createAuthError(
          'Invalid email or password. Please check your credentials and try again.',
          supabaseError.message,
          'auth'
        );

        await this.logSecurityEvent({
          eventType: 'login',
          description: 'Failed login attempt',
          ipAddress,
          userAgent,
          riskLevel: 'medium',
          metadata: { 
            email: credentials.email, 
            error: supabaseError.message,
            attemptNumber: this.loginAttempts.get(credentials.email) || 1
          }
        });

        await enterpriseLogger.log({
          level: 'warn',
          message: 'Sign in failed',
          component: 'AuthService',
          metadata: {
            email: credentials.email, 
            error: supabaseError.message,
            duration: `${(performance.now() - startTime).toFixed(2)}ms`
          }
        });

        return { error };
      }

      if (!data.user || !data.session) {
        const error = this.createAuthError('Authentication failed', 'NO_USER_DATA');
        return { error };
      }

      // Success - reset login attempts
      this.resetLoginAttempts(credentials.email);

      // Create session info
      await this.createSessionInfo(data.session, {
        ipAddress,
        userAgent
      });

      await this.logSecurityEvent({
        userId: data.user.id,
        sessionId: data.session.access_token.slice(-10),
        eventType: 'login',
        description: 'Successful login',
        ipAddress,
        userAgent,
        riskLevel: 'low',
        metadata: { email: credentials.email }
      });

      await logger.info('Sign in successful', { 
        userId: data.user.id,
        email: credentials.email,
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { 
        data: { 
          user: data.user as AuthUser, 
          session: data.session as AuthSession 
        }, 
        error: null 
      };

    } catch (error) {
      const authError = this.createAuthError(
        'An unexpected error occurred during sign in. Please try again.',
        'UNEXPECTED_ERROR',
        'server'
      );

      await logger.error('Sign in error', { 
        email: credentials.email, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { error: authError };
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<{ data?: { user: AuthUser; session: AuthSession | null }; error: AuthError | null }> {
    const startTime = performance.now();
    const { ipAddress, userAgent } = this.getClientInfo();

    try {
      await logger.info('Sign up attempt started', { email: credentials.email }, 'AuthService');

      // Validate credentials
      const validationError = this.validateSignUpCredentials(credentials);
      if (validationError) {
        return { error: validationError };
      }

      const redirectUrl = `${window.location.origin}/`;

      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: credentials.fullName || ''
          }
        }
      });

      if (supabaseError) {
        const error = this.createAuthError(
          supabaseError.message === 'User already registered' 
            ? 'An account with this email already exists. Please sign in instead.'
            : 'Failed to create account. Please try again.',
          supabaseError.message,
          'auth'
        );

        await this.logSecurityEvent({
          eventType: 'login',
          description: 'Failed sign up attempt',
          ipAddress,
          userAgent,
          riskLevel: 'low',
          metadata: { 
            email: credentials.email, 
            error: supabaseError.message 
          }
        });

        await logger.warn('Sign up failed', { 
          email: credentials.email, 
          error: supabaseError.message,
          duration: `${(performance.now() - startTime).toFixed(2)}ms`
        }, 'AuthService');

        return { error };
      }

      if (!data.user) {
        const error = this.createAuthError('Failed to create user account', 'NO_USER_DATA');
        return { error };
      }

      // Log successful signup
      await this.logSecurityEvent({
        userId: data.user.id,
        sessionId: data.session?.access_token.slice(-10),
        eventType: 'login',
        description: 'Successful sign up',
        ipAddress,
        userAgent,
        riskLevel: 'low',
        metadata: { email: credentials.email }
      });

      await logger.info('Sign up successful', { 
        userId: data.user.id,
        email: credentials.email,
        hasSession: !!data.session,
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { 
        data: { 
          user: data.user as AuthUser, 
          session: data.session as AuthSession | null 
        }, 
        error: null 
      };

    } catch (error) {
      const authError = this.createAuthError(
        'An unexpected error occurred during sign up. Please try again.',
        'UNEXPECTED_ERROR',
        'server'
      );

      await logger.error('Sign up error', { 
        email: credentials.email, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { error: authError };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const startTime = performance.now();
    const { ipAddress, userAgent } = this.getClientInfo();

    try {
      await logger.info('Sign out started', {}, 'AuthService');

      const { error: supabaseError } = await supabase.auth.signOut();

      if (supabaseError) {
        const error = this.createAuthError(
          'Failed to sign out properly. Please clear your browser data.',
          supabaseError.message
        );

        await logger.warn('Sign out failed', { 
          error: supabaseError.message,
          duration: `${(performance.now() - startTime).toFixed(2)}ms`
        }, 'AuthService');

        return { error };
      }

      await this.logSecurityEvent({
        eventType: 'logout',
        description: 'User logged out',
        ipAddress,
        userAgent,
        riskLevel: 'low',
        metadata: {}
      });

      await logger.info('Sign out successful', { 
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { error: null };

    } catch (error) {
      const authError = this.createAuthError(
        'An unexpected error occurred during sign out.',
        'UNEXPECTED_ERROR',
        'server'
      );

      await logger.error('Sign out error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'AuthService');

      return { error: authError };
    }
  }

  private validateSignUpCredentials(credentials: SignUpCredentials): AuthError | null {
    if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
      return this.createAuthError('All fields are required', 'MISSING_FIELDS', 'validation');
    }

    if (!this.isValidEmail(credentials.email)) {
      return this.createAuthError('Please enter a valid email address', 'INVALID_EMAIL', 'validation');
    }

    if (credentials.password.length < 8) {
      return this.createAuthError('Password must be at least 8 characters long', 'WEAK_PASSWORD', 'validation');
    }

    if (credentials.password !== credentials.confirmPassword) {
      return this.createAuthError('Passwords do not match', 'PASSWORD_MISMATCH', 'validation');
    }

    if (!credentials.acceptTerms) {
      return this.createAuthError('You must accept the terms and conditions', 'TERMS_NOT_ACCEPTED', 'validation');
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async createSessionInfo(session: AuthSession, context: { ipAddress: string; userAgent: string }): Promise<void> {
    try {
      const sessionInfo: Partial<SessionInfo> = {
        userId: session.user.id,
        deviceId: this.generateDeviceId(),
        deviceInfo: this.getDeviceInfo(),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        createdAt: new Date(),
        lastActivity: new Date(),
        expiresAt: new Date(session.expires_at! * 1000),
        isActive: true
      };

      // Store session info (this would be in a sessions table)
      await logger.debug('Session info created', sessionInfo, 'AuthService');
    } catch (error) {
      await logger.error('Failed to create session info', { error }, 'AuthService');
    }
  }

  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): any {
    const ua = navigator.userAgent;
    return {
      type: /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop',
      os: this.getOS(ua),
      browser: this.getBrowser(ua),
      fingerprint: this.generateFingerprint()
    };
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substr(0, 32);
  }

  async getCurrentSession(): Promise<{ session: AuthSession | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { 
          session: null, 
          error: this.createAuthError('Failed to get current session', error.message) 
        };
      }
      
      return { 
        session: data.session as AuthSession | null, 
        error: null 
      };
    } catch (error) {
      return { 
        session: null, 
        error: this.createAuthError('Unexpected error getting session', 'UNEXPECTED_ERROR', 'server') 
      };
    }
  }

  async refreshSession(): Promise<{ session: AuthSession | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { 
          session: null, 
          error: this.createAuthError('Failed to refresh session', error.message) 
        };
      }
      
      return { 
        session: data.session as AuthSession | null, 
        error: null 
      };
    } catch (error) {
      return { 
        session: null, 
        error: this.createAuthError('Unexpected error refreshing session', 'UNEXPECTED_ERROR', 'server') 
      };
    }
  }
}

export const authService = AuthenticationService.getInstance();