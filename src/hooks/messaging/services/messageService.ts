
import { supabase } from '@/integrations/supabase/client';
import { RealTimeMessage, SendMessageParams } from '../types';
import { CacheService } from './cacheService';

export class MessageService {
  static async fetchMessages(
    userId: string, 
    currentRoom?: string
  ): Promise<RealTimeMessage[]> {
    try {
      if (!currentRoom) return [];

      const { data: messages, error } = await supabase
        .from('network_messages')
        .select(`
          *,
          sender_profile:profiles!network_messages_sender_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${currentRoom},receiver_id.eq.${currentRoom}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      // Transform to RealTimeMessage format using actual database fields
      const realTimeMessages: RealTimeMessage[] = (messages || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        connection_id: currentRoom,
        created_at: msg.created_at,
        updated_at: msg.created_at, // Use created_at since updated_at doesn't exist
        message_type: 'text', // Default since field doesn't exist
        file_name: undefined,
        file_url: undefined,
        reply_to_id: undefined,
        reactions: (typeof msg.reactions === 'object' && msg.reactions !== null) ? msg.reactions as Record<string, any> : {},
        read_by: [],
        sender_profile: Array.isArray(msg.sender_profile) && msg.sender_profile.length > 0 
          ? msg.sender_profile[0]
          : {
              full_name: 'Unknown User',
              avatar_url: null,
            },
      }));

      return realTimeMessages;
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      return [];
    }
  }

  static async sendMessage(
    userId: string,
    currentRoom: string,
    params: SendMessageParams
  ): Promise<boolean> {
    try {
      const messageData = {
        sender_id: userId,
        receiver_id: currentRoom,
        content: params.content,
        attachment_data: params.fileData || null
      };

      const { error } = await supabase
        .from('network_messages')
        .insert(messageData);

      if (error) {
        console.error('Error sending message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return false;
    }
  }

  static async addReaction(
    messageId: string,
    emoji: string,
    userId: string,
    currentReactions: any
  ): Promise<Record<string, any> | null> {
    try {
      // For now, just return updated reactions object
      console.log('Adding reaction:', { messageId, userId, emoji });
      const updatedReactions = { ...currentReactions };
      if (!updatedReactions[emoji]) {
        updatedReactions[emoji] = [];
      }
      updatedReactions[emoji].push({ user_id: userId, created_at: new Date().toISOString() });
      return updatedReactions;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return null;
    }
  }

}

// Export static class, no need for instance
