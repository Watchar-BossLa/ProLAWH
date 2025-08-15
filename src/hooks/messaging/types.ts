export interface RealTimeMessage {
  id: string;
  content: string;
  sender_id: string;
  connection_id?: string;
  chat_room_id?: string;
  created_at: string;
  updated_at: string;
  message_type: string;
  file_name?: string;
  file_url?: string;
  reply_to_id?: string;
  reactions: Record<string, any>;
  read_by?: string[];
  sender_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_private?: boolean;
  member_count?: number;
  last_activity?: string;
  chat_participants: { user_id: string }[];
  last_message?: any;
}

export interface SendMessageParams {
  content: string;
  type?: string;
  fileData?: {
    name: string;
    url: string;
  };
}