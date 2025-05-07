
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

export interface NetworkConnection {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  skills?: string[];
  industry?: string;
  onlineStatus?: 'online' | 'away' | 'offline';
  connectionType?: 'mentor' | 'peer' | 'colleague';
  // Additional properties used in the codebase
  userId?: string;
  connectionStrength?: number;
  lastInteraction?: string;
  status?: string;
  bio?: string;
  location?: string;
  careerPath?: string;
  expertise?: string[];
  unreadMessages?: number;
  mentorship?: MentorshipDetails;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  requesterId: string;
  message: string;
  status: string;
  focusAreas: string[];
  industry?: string;
  expectedDuration?: string;
  createdAt: string;
  goals?: string[] | string;
  mentor_id?: string; // For backward compatibility
  requester_id?: string; // For backward compatibility
  focus_areas?: string[]; // For backward compatibility
}

// Additional interfaces needed for the network components
export interface NetworkMessage extends Message {
  read?: boolean;
  attachments?: string[];
  receiverId?: string;
}

export interface NetworkStats {
  totalConnections: number;
  newConnectionsThisMonth: number;
  activeEngagements: number;
  connectionsByIndustry: Record<string, number>;
  mentorshipStats: {
    active: number;
    completed: number;
    pending: number;
  };
  skillMatches: {
    skill: string;
    count: number;
  }[];
  // Additional properties needed by the components
  mentors: number;
  peers: number;
  colleagues: number;
  pendingRequests: number;
}

export interface MentorshipResource {
  id: string;
  title: string;
  type: 'article' | 'course' | 'book' | 'video' | 'other';
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

export interface MentorshipDetails {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  startDate?: string;
  focusAreas?: string[];
  meetingFrequency?: string;
  nextMeetingDate?: string;
  industry?: string;
  resources?: MentorshipResource[];
  goals?: string[];
  progress?: MentorshipProgress[];
}
