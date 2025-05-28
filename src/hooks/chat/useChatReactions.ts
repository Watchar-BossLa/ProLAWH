
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useChatReactions(setMessages: React.Dispatch<React.SetStateAction<any[]>>) {
  const { user } = useAuth();

  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      // Mock implementation
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r: any) => r.user_id === user.id && r.reaction === reaction);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r: any) => !(r.user_id === user.id && r.reaction === reaction))
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, {
                id: Date.now().toString(),
                message_id: messageId,
                user_id: user.id,
                reaction,
                created_at: new Date().toISOString()
              }]
            };
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [user, setMessages]);

  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions.filter((r: any) => !(r.user_id === user.id && r.reaction === reaction))
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [user, setMessages]);

  return {
    addReaction,
    removeReaction
  };
}
