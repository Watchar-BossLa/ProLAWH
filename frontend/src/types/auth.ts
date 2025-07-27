/**
 * Authentication Type Definitions
 * Comprehensive type safety for authentication system
 */

import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  app_metadata: {
    provider?: string;
    role?: string;
    [key: string]: any;
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export interface AuthError {
  message: string;
  code?: string;
  type: 'auth' | 'network' | 'validation' | 'server';
  timestamp: Date;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  acceptTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthContextType {
  // State
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  
  // Actions
  signIn: (credentials: SignInCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (request: PasswordResetRequest) => Promise<{ error: AuthError | null }>;
  updatePassword: (request: PasswordUpdateRequest) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<{ error: AuthError | null }>;
  clearError: () => void;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  fingerprint: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: Date;
  location?: {
    country: string;
    city: string;
  };
}

export interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'moderator' | 'user' | 'mentor' | 'employer';
  assignedAt: Date;
  assignedBy: string;
  expiresAt?: Date;
}

export interface SecurityEvent {
  id: string;
  userId?: string;
  sessionId?: string;
  eventType: 'login' | 'logout' | 'password_change' | 'role_change' | 'suspicious_activity';
  description: string;
  ipAddress: string;
  userAgent: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
  timestamp: Date;
}