
export const DEVELOPMENT_CONFIG = {
  // Set to true to bypass authentication in development
  BYPASS_AUTH: true,
  
  // Mock user for development (when BYPASS_AUTH is true)
  MOCK_USER: {
    id: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID format
    email: "dev@prolawh.com",
    user_metadata: {
      full_name: "Development User"
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};
