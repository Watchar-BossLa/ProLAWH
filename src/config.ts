// ProLawh Configuration
export const ENV = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};

export const CONFIG = {
  // Development configuration
  BYPASS_AUTH: false, // Set to true only for development testing
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'developer@prolawh.dev',
    user_metadata: {
      full_name: 'Developer User'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  },
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8001',
  
  // Supabase Configuration (if needed)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Feature Flags
  FEATURES: {
    REAL_TIME_CHAT: true,
    AI_RECOMMENDATIONS: true,
    BLOCKCHAIN_CREDENTIALS: true,
    QUANTUM_MATCHING: true,
    GREEN_ECONOMY: true,
  },
  
  // Security Configuration
  SECURITY: {
    SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
  },
  
  // Session Configuration
  SESSION: {
    TIMEOUT: 3600000, // 1 hour in milliseconds
    REFRESH_THRESHOLD: 300000, // 5 minutes
    STORAGE_KEY: 'prolawh_session',
    MAX_SESSIONS_PER_USER: 5,
    PERSIST_SESSION: true,
    AUTO_REFRESH_TOKEN: true,
  },
  
  // Application Settings
  APP: {
    NAME: 'ProLawh',
    VERSION: '2.0.0',
    DESCRIPTION: 'AI-Native Learning & Workforce Hub',
  }
};

export default CONFIG;