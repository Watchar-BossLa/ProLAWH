
export const PRODUCTION_CONFIG = {
  // Production authentication settings
  BYPASS_AUTH: false, // Always false in production
  
  // Mock user for development (only used if BYPASS_AUTH is true)
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'dev@prolawh.com',
    user_metadata: {
      full_name: 'Development User'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  },
  
  // Enterprise system settings
  ENTERPRISE: {
    ENABLE_MONITORING: true,
    ENABLE_LOGGING: true,
    LOG_LEVEL: 'warn' as const, // Less verbose in production
    HEALTH_CHECK_INTERVAL: 300000, // 5 minutes in production
    METRICS_RETENTION_DAYS: 30
  },
  
  // Performance settings
  PERFORMANCE: {
    ENABLE_DETAILED_METRICS: false, // Reduce overhead in production
    LOG_SLOW_QUERIES: true,
    SLOW_QUERY_THRESHOLD: 2000 // ms - more conservative threshold
  },

  // Session management
  SESSION: {
    PERSIST_SESSION: true,
    AUTO_REFRESH_TOKEN: true,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    ACTIVITY_UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MAX_SESSIONS_PER_USER: 5
  },

  // Security settings
  SECURITY: {
    ENFORCE_MFA: false, // Can be enabled based on requirements
    SESSION_VALIDATION: true,
    STRICT_CORS: true,
    SECURE_COOKIES: true
  }
};
