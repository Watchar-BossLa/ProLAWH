
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
