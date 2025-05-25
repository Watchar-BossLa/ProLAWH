
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reactions: Record<string, string[]>;
  thread_id?: string;
  reply_to?: string;
}

export interface SendMessageParams {
  content: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to?: string;
}

export interface TypingPresence {
  typing?: boolean;
  user_id?: string;
  presence_ref: string;
}
