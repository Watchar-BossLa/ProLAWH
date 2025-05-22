
import { Json } from '@/integrations/supabase/types';

export interface Reaction {
  emoji: string;
  user_id: string;
  created_at: string;
}

export type MessageReactionsData = {
  [emoji: string]: Reaction[];
};

// Database representation of a message
export interface DatabaseMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment_data?: Json;
  reactions?: Json;
  created_at?: string;
}

// Frontend representation of a message
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment_data?: any;
  reactions: MessageReactionsData;
}

export interface SendMessageParams {
  content: string;
  sender_id: string;
  receiver_id: string;
  attachment_data?: any;
}
