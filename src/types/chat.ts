
// Define the shape of a reaction
export interface Reaction {
  emoji: string;
  user_id: string;
  created_at: string;
}

// Map of emoji to array of reactions
export interface MessageReactionsData {
  [emoji: string]: Reaction[];
}

// Message as stored in the database
export interface DatabaseMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment_data: any;
  reactions: any;
  created_at?: string;
}

// Message as used in the frontend
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
