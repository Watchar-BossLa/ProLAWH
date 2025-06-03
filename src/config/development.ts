
export const DEVELOPMENT_CONFIG = {
  // Development bypass for testing without auth
  BYPASS_AUTH: false, // Set to true only for development
  
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
    LOG_LEVEL: 'debug' as const,
    HEALTH_CHECK_INTERVAL: 60000, // 1 minute in development
    METRICS_RETENTION_DAYS: 7
  },
  
  // Performance settings
  PERFORMANCE: {
    ENABLE_DETAILED_METRICS: true,
    LOG_SLOW_QUERIES: true,
    SLOW_QUERY_THRESHOLD: 1000 // ms
  }
};
