const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('prolawh_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('prolawh_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('prolawh_token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/auth';
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        error: response.ok ? undefined : data.detail || 'An error occurred'
      };
    } catch (error) {
      return {
        status: 500,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{access_token: string, user: any}>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, full_name: string) {
    return this.request<{access_token: string, user: any}>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, role: 'learner' }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me');
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<any>('/api/dashboard/stats');
  }

  async getRecommendations() {
    return this.request<any>('/api/dashboard/recommendations');
  }

  // Courses
  async getCourses(skip = 0, limit = 20) {
    return this.request<any[]>(`/api/courses?skip=${skip}&limit=${limit}`);
  }

  async searchCourses(query: string, category?: string) {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    return this.request<any[]>(`/api/courses/search?${params}`);
  }

  async getCourse(courseId: string) {
    return this.request<any>(`/api/courses/${courseId}`);
  }

  async enrollInCourse(courseId: string) {
    return this.request<any>(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async getMyCourses() {
    return this.request<any[]>('/api/my/courses');
  }

  // Mentorship
  async getMentors(specialties?: string[], skip = 0, limit = 20) {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    if (specialties?.length) {
      specialties.forEach(s => params.append('specialties', s));
    }
    return this.request<any[]>(`/api/mentors?${params}`);
  }

  async requestMentorship(mentorId: string, goals: string[], message?: string) {
    return this.request<any>('/api/mentorship/request', {
      method: 'POST',
      body: JSON.stringify({
        mentor_id: mentorId,
        goals,
        message,
      }),
    });
  }

  async getMyMentorships() {
    return this.request<any>('/api/my/mentorships');
  }

  async getMySessions() {
    return this.request<any[]>('/api/my/sessions');
  }

  // Opportunities
  async getOpportunities(skip = 0, limit = 20, jobType?: string, location?: string) {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    if (jobType) params.append('job_type', jobType);
    if (location) params.append('location', location);
    return this.request<any[]>(`/api/opportunities?${params}`);
  }

  async getOpportunity(jobId: string) {
    return this.request<any>(`/api/opportunities/${jobId}`);
  }

  async applyToJob(jobId: string, coverLetter?: string, resumeUrl?: string) {
    return this.request<any>(`/api/opportunities/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      }),
    });
  }

  // Chat
  async getMyChats() {
    return this.request<any[]>('/api/chats');
  }

  async createChat(name?: string, chatType = 'group', participants: string[] = []) {
    return this.request<any>('/api/chats', {
      method: 'POST',
      body: JSON.stringify({
        name,
        chat_type: chatType,
        participants,
      }),
    });
  }

  async getChatMessages(chatId: string, skip = 0, limit = 50) {
    return this.request<any[]>(`/api/chats/${chatId}/messages?skip=${skip}&limit=${limit}`);
  }

  async sendMessage(chatId: string, content: string, messageType = 'text') {
    return this.request<any>(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        content,
        message_type: messageType,
      }),
    });
  }

  // AI & Analytics
  async getSkillPath(targetRole: string) {
    return this.request<any>(`/api/ai/skill-path?target_role=${encodeURIComponent(targetRole)}`);
  }

  async getLearningAnalytics() {
    return this.request<any>('/api/analytics/learning');
  }

  async getProgressReport(period = 'monthly') {
    return this.request<any>(`/api/analytics/progress-report?period=${period}`);
  }

  // Users
  async getUsers(skip = 0, limit = 50) {
    return this.request<any[]>(`/api/users?skip=${skip}&limit=${limit}`);
  }

  async searchUsers(query: string, skip = 0, limit = 20) {
    return this.request<any[]>(`/api/users/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  }

  async updateProfile(data: any) {
    return this.request<any>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL || 'http://localhost:8001');
export default apiClient;