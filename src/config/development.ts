
// Development configuration
export const DEVELOPMENT_CONFIG = {
  // Set to true to bypass authentication in development
  BYPASS_AUTH: true,
  
  // Mock user data for development mode
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'dev@example.com',
    user_metadata: {
      name: 'Developer User'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};
