
import { Json } from '@/integrations/supabase/types';

export interface Reaction {
  emoji: string;
  user_id: string;
  created_at: string;
}

// Type for our frontend representation of reactions
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
  reactions?: Json; // This needs to be Json for Supabase compatibility
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
  reactions: MessageReactionsData; // We ensure this is always the correct type in our app
}

export interface SendMessageParams {
  content: string;
  sender_id: string;
  receiver_id: string;
  attachment_data?: any;
}
