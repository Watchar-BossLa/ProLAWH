
export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participant_count?: number;
  last_message?: ChatMessage;
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
  timestamp: string;
  type: 'text' | 'file' | 'image';
  sender_name: string;
  sender_avatar?: string;
  reply_to?: string;
  edited_at?: string;
  read_by?: ReadReceiptData[];
  sender_profile: {
    full_name: string;
    avatar_url?: string;
  };
  reactions: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface MessageReactionsData {
  [emoji: string]: MessageReaction[];
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface ReadReceiptData {
  user_id: string;
  user_name: string;
  user_avatar?: string;
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

export interface TypingPresence {
  user_id: string;
  chat_id: string;
  is_typing: boolean;
  last_activity: string;
}

export interface SendMessageParams {
  content: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to?: string;
}
