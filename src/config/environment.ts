/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  APP_NAME: string;
  APP_VERSION: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  SESSION_TIMEOUT_MINUTES: number;
  MAX_LOGIN_ATTEMPTS: number;
}

// Environment variable validation
function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    SUPABASE_URL: 'https://pynytoroxsqvfxybjeft.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnl0b3JveHNxdmZ4eWJqZWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjIwMjQsImV4cCI6MjA1ODUzODAyNH0.favQUuv9yeE3Xx-IxM6Hk5NHSqRf2Lb4DpA8cnbN9qQ',
    APP_NAME: 'ProLawh',
    APP_VERSION: '2.0.0',
    LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
    ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
    SESSION_TIMEOUT_MINUTES: 60,
    MAX_LOGIN_ATTEMPTS: 5
  };

  // Validate required fields
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('Missing required Supabase configuration');
  }

  return config;
}

export const ENV = validateEnvironment();

// Security configuration
export const SECURITY_CONFIG = {
  CSRF_PROTECTION: true,
  SECURE_HEADERS: true,
  RATE_LIMITING: true,
  SESSION_SECURITY: true,
  MFA_ENABLED: true,
  AUDIT_LOGGING: true
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENHANCED_CHAT: true,
  AI_RECOMMENDATIONS: true,
  BLOCKCHAIN_CREDENTIALS: true,
  QUANTUM_MATCHING: true,
  REAL_TIME_COLLABORATION: true,
  ENTERPRISE_FEATURES: true
} as const;