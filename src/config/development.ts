
// Development configuration
export const DEVELOPMENT_CONFIG = {
  // Set to true to bypass authentication in development
  BYPASS_AUTH: true,
  
  // Mock user data for development mode - complete User object
  MOCK_USER: {
    id: 'dev-user-123',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'dev@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      name: 'Developer User'
    },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};
