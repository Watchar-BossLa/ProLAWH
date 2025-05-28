
export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participant_count?: number;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  sender_profile: {
    full_name: string;
  };
  reactions: MessageReaction[];
  read_receipts: ReadReceipt[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface TypingIndicator {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  last_activity: string;
  user_profile: {
    full_name: string;
  };
}

export interface SendMessageParams {
  content: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to?: string;
}
