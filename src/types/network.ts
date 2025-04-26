
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
}

export interface NetworkStats {
  totalConnections: number;
  mentors: number;
  peers: number;
  colleagues: number;
  pendingRequests: number;
}
