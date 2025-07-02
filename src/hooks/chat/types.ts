
export interface ChatRoom {
  id: string;
  name?: string;
  type: 'direct' | 'group' | 'channel';
  description?: string;
  avatar_url?: string;
  created_by: string;
  is_private: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  chat_participants: ChatParticipant[];
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_read_at?: string;
  is_muted: boolean;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'file' | 'image' | 'video' | 'voice' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  reply_to_id?: string;
  thread_id?: string;
  is_edited: boolean;
  is_pinned: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  reactions: MessageReaction[];
  read_receipts: ReadReceipt[];
  sender_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  // Legacy compatibility properties
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'video' | 'voice' | 'system';
  sender_name?: string;
  sender_avatar?: string;
  read_by?: ReadByUser[];
}

export interface ReadByUser {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  read_at: string;
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
  id: string;
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  last_activity: string;
}

export interface TypingUser {
  user_id: string;
  user_name?: string;
  last_activity: string;
}

export interface TypingPresence {
  user_id: string;
  chat_id: string;
  is_typing: boolean;
  last_activity: string;
}

export interface UserPresence {
  id: string;
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_active: string;
  typing_in_chat?: string;
  created_at: string;
  updated_at: string;
}

// Search-related types
export interface SearchFilters {
  messageType?: 'text' | 'file' | 'image' | 'video' | 'voice';
  sender?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasAttachments?: boolean;
  hasReactions?: boolean;
  hasReplies?: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'user' | 'keyword' | 'hashtag';
  count?: number;
}

// Message sending types
export interface SendMessageParams {
  content: string;
  type?: 'text' | 'file' | 'image' | 'video' | 'voice';
  file_url?: string;
  file_name?: string;
  reply_to_id?: string;
}
