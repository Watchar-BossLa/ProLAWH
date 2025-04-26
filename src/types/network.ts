
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
