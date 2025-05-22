
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { ChatMessage, MessageReactionsData, Reaction } from '@/types/chat';

export function useMessageReactions(messages: ChatMessage[], setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) {
  const reactToMessage = async (messageId: string, emoji: string, userId: string) => {
    if (!userId) return;
    
    try {
      // Find the message to update
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate) return;
      
      // Create a copy of the reactions
      const updatedReactions: MessageReactionsData = { ...(messageToUpdate.reactions || {}) };
      
      // Check if user already reacted with this emoji
      const hasUserReactedWithEmoji = updatedReactions[emoji]?.some(
        reaction => reaction.user_id === userId
      );
      
      if (hasUserReactedWithEmoji) {
        // Remove the reaction
        updatedReactions[emoji] = updatedReactions[emoji].filter(
          reaction => reaction.user_id !== userId
        );
        
        // Remove empty emoji arrays
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        // Remove user reaction from any other emoji
        Object.keys(updatedReactions).forEach(existingEmoji => {
          updatedReactions[existingEmoji] = updatedReactions[existingEmoji].filter(
            reaction => reaction.user_id !== userId
          );
          
          if (updatedReactions[existingEmoji].length === 0) {
            delete updatedReactions[existingEmoji];
          }
        });
        
        // Add the new reaction
        if (!updatedReactions[emoji]) {
          updatedReactions[emoji] = [];
        }
        
        updatedReactions[emoji].push({
          emoji,
          user_id: userId,
          created_at: new Date().toISOString()
        });
      }
      
      // Update the message in the database
      // Cast the updatedReactions to Json since Supabase expects that type
      const { error } = await supabase
        .from('network_messages')
        .update({ 
          reactions: updatedReactions as any
        })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: updatedReactions } 
            : msg
        )
      );
      
    } catch (error) {
      console.error('Error updating message reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  return { reactToMessage };
}
