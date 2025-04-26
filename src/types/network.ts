
export interface NetworkConnection {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: string;
  company: string;
  connectionType: 'mentor' | 'peer' | 'colleague';
  connectionStrength: number; // 0-100 based on interactions
  lastInteraction: string;
  status: 'pending' | 'connected' | 'blocked';
  skills?: string[];
  bio?: string;
  location?: string;
  onlineStatus?: 'online' | 'away' | 'offline';
  unreadMessages?: number;
  industry?: string;
  careerPath?: string;
  expertise?: string[];
  mentorship?: MentorshipDetails;
}

export interface MentorshipDetails {
  id: string;
  status: 'active' | 'pending' | 'declined' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
  focusAreas: string[];
  meetingFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'asNeeded';
  nextMeetingDate?: string;
  industry: string;
  resources?: MentorshipResource[];
  goals?: string[];
  progress?: MentorshipProgress[];
}

export interface MentorshipResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'other';
  url?: string;
  description?: string;
  addedBy: string;
  addedAt: string;
  completed?: boolean;
}

export interface MentorshipProgress {
  id: string;
  date: string;
  milestone: string;
  notes?: string;
  completed: boolean;
}

export interface NetworkStats {
  totalConnections: number;
  mentors: number;
  peers: number;
  colleagues: number;
  pendingRequests: number;
}

export interface NetworkMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    id: string;
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
  }[];
}

export interface ChatThread {
  connectionId: string;
  messages: NetworkMessage[];
  lastActivity: string;
}

export interface IndustryCategory {
  id: string;
  name: string;
  subcategories?: IndustryCategory[];
}

export interface CareerPath {
  id: string;
  name: string;
  description?: string;
  relatedIndustries: string[];
  commonSkills: string[];
  growthRate?: number;
}

export interface MentorshipRequest {
  id: string;
  requesterId: string;
  mentorId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  focusAreas: string[];
  industry: string;
  expectedDuration?: string;
  goals?: string[];
}
