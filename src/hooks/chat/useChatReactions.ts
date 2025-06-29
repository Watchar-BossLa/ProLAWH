
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ChatMessage } from './types';

export function useChatReactions(setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) {
  const { user } = useAuth();

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      // Check if user already reacted with this emoji
      const { data: existing } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', emoji)
        .single();

      if (existing) {
        // Remove existing reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;

        // Update local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions.filter(r => 
                !(r.user_id === user.id && r.reaction === emoji)
              )
            };
          }
          return msg;
        }));
      } else {
        // Add new reaction
        const { data, error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction: emoji
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: [...msg.reactions, data]
            };
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    }
  }, [user, setMessages]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', emoji);

      if (error) throw error;

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions.filter(r => 
              !(r.user_id === user.id && r.reaction === emoji)
            )
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast({
        title: "Error",
        description: "Failed to remove reaction",
        variant: "destructive"
      });
    }
  }, [user, setMessages]);

  return {
    addReaction,
    removeReaction
  };
}
