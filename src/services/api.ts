interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

interface AuthResponse {
  data?: {
    access_token: string;
    user: AuthUser;
  };
  error?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;
  private baseUrl = '/api'; // Mock API base URL

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('prolawh_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('prolawh_token');
    localStorage.removeItem('prolawh_user');
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser> & { status: number }> {
    try {
      if (!this.token) {
        return { error: 'No token provided', status: 401 };
      }
      
      // Mock user data for development
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'demo@prolawh.com',
        user_metadata: {
          full_name: 'Demo User'
        }
      };

      return { data: mockUser, status: 200 };
    } catch (error) {
      return { error: 'Failed to get current user', status: 500 };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Mock login for development
      const mockUser: AuthUser = {
        id: 'user-123',
        email,
        user_metadata: {
          full_name: 'Demo User'
        }
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        data: {
          access_token: mockToken,
          user: mockUser
        }
      };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      // Mock registration for development
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        email,
        user_metadata: {
          full_name: fullName
        }
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        data: {
          access_token: mockToken,
          user: mockUser
        }
      };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }

  // Mock API methods for dashboard functionality
  async getDashboardStats() {
    return {
      data: {
        courses_completed: 12,
        skills_verified: 8,
        network_connections: 156,
        learning_streak: 14,
        total_learning_hours: 240
      },
      error: null,
      status: 200
    };
  }

  async getRecommendations() {
    return {
      data: [
        { id: 1, title: "Advanced React Patterns", type: "course" },
        { id: 2, title: "System Design Interview", type: "course" },
        { id: 3, title: "Tech Lead Role at StartupCo", type: "opportunity" }
      ],
      error: null,
      status: 200
    };
  }

  async getCourses(skip = 0, limit = 20) {
    return {
      data: {
        courses: [
          { id: 1, title: "React Fundamentals", progress: 85 },
          { id: 2, title: "Node.js Mastery", progress: 60 },
          { id: 3, title: "System Design", progress: 30 }
        ]
      },
      error: null,
      status: 200
    };
  }

  async getMentors(specialties?: string[], skip = 0, limit = 20) {
    return {
      data: [
        { id: 1, name: "Sarah Chen", expertise: "React Development" },
        { id: 2, name: "Alex Rodriguez", expertise: "System Architecture" }
      ],
      error: null,
      status: 200
    };
  }

  async getOpportunities(skip = 0, limit = 20) {
    return {
      data: [
        { id: 1, title: "Senior Frontend Developer", company: "TechCorp" },
        { id: 2, title: "React Consultant", company: "StartupCo" }
      ],
      error: null,
      status: 200
    };
  }

  async getMyChats() {
    return {
      data: [
        { id: 1, name: "React Study Group", lastMessage: "Great discussion today!" },
        { id: 2, name: "Career Mentorship", lastMessage: "Let's schedule a call" }
      ],
      error: null,
      status: 200
    };
  }

  async getLearningAnalytics() {
    return {
      data: {
        weeklyProgress: [
          { week: "Week 1", hours: 12 },
          { week: "Week 2", hours: 15 },
          { week: "Week 3", hours: 18 },
          { week: "Week 4", hours: 14 }
        ]
      },
      error: null,
      status: 200
    };
  }
}

const apiClient = new ApiClient();
export default apiClient;