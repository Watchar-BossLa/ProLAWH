
// Legacy chat types - re-exporting from the main chat types for backward compatibility
export {
  type ChatMessage,
  type DatabaseMessage,
  type MessageReactionsData,
  type SendMessageParams
} from '@/hooks/chat/types';

// Define the shape of a reaction for backward compatibility
export interface Reaction {
  emoji: string;
  user_id: string;
  created_at: string;
}
