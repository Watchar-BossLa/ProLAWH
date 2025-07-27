
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from './types';

export function useMessageReactions(messages: ChatMessage[]) {
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const currentReactions = message.reactions || {};
      const emojiReactions = currentReactions[emoji] || [];
      
      let updatedReactions: Record<string, string[]>;
      
      if (emojiReactions.includes(user.id)) {
        // Remove reaction
        updatedReactions = {
          ...currentReactions,
          [emoji]: emojiReactions.filter(id => id !== user.id)
        };
        
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        // Add reaction
        updatedReactions = {
          ...currentReactions,
          [emoji]: [...emojiReactions, user.id]
        };
      }

      const { error } = await supabase
        .from('chat_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [messages]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const currentReactions = message.reactions || {};
      const emojiReactions = currentReactions[emoji] || [];
      
      const updatedReactions = {
        ...currentReactions,
        [emoji]: emojiReactions.filter(id => id !== user.id)
      };

      if (updatedReactions[emoji].length === 0) {
        delete updatedReactions[emoji];
      }

      const { error } = await supabase
        .from('chat_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [messages]);

  return { addReaction, removeReaction };
}
