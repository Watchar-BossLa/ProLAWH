
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, SendMessageParams } from '@/hooks/chat/types';
import { CacheService } from './cacheService';

export class MessageService {
  static async fetchMessages(
    connectionId: string, 
    limit: number = 50,
    before?: string
  ): Promise<ChatMessage[]> {
    try {
      // Check cache first
      const cachedMessages = await CacheService.getChatMessages(connectionId);
      if (cachedMessages && cachedMessages.length > 0) {
        return cachedMessages;
      }

      let query = supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data: messages, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      // Fetch profiles separately since the join doesn't work
      const senderIds = [...new Set((messages || []).map(msg => msg.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Transform to ChatMessage format
      const chatMessages: ChatMessage[] = (messages || []).map(msg => {
        const profile = profileMap.get(msg.sender_id);
        
        return {
          id: msg.id,
          chat_id: connectionId,
          sender_id: msg.sender_id,
          content: msg.content,
          message_type: (msg.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
          file_url: msg.file_url,
          file_name: msg.file_name,
          file_size: undefined,
          file_type: undefined,
          reply_to_id: msg.reply_to_id,
          thread_id: undefined,
          is_edited: false,
          is_pinned: false,
          metadata: {},
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          edited_at: undefined,
          reactions: [],
          read_receipts: [],
          sender_profile: {
            full_name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url || null,
          },
          timestamp: msg.created_at,
          type: (msg.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
          sender_name: profile?.full_name || 'Unknown User',
          sender_avatar: profile?.avatar_url || null,
          read_by: [],
          receiver_id: undefined,
          read: false,
          attachment_data: null,
        };
      });

      // Cache the messages
      await CacheService.setChatMessages(connectionId, chatMessages);

      return chatMessages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      return [];
    }
  }

  static async sendMessage(
    connectionId: string,
    userId: string,
    params: SendMessageParams
  ): Promise<ChatMessage | null> {
    try {
      const messageData = {
        connection_id: connectionId,
        sender_id: userId,
        content: params.content,
        message_type: params.type || 'text',
        file_url: params.file_url,
        file_name: params.file_name,
        reply_to_id: params.reply_to_id
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messageData)
        .select('*')
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // Fetch user profile separately
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', userId)
        .single();

      // Transform to ChatMessage format
      const chatMessage: ChatMessage = {
        id: data.id,
        chat_id: connectionId,
        sender_id: data.sender_id,
        content: data.content,
        message_type: (data.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        file_url: data.file_url,
        file_name: data.file_name,
        file_size: undefined,
        file_type: undefined,
        reply_to_id: data.reply_to_id,
        thread_id: undefined,
        is_edited: false,
        is_pinned: false,
        metadata: {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        edited_at: undefined,
        reactions: [],
        read_receipts: [],
        sender_profile: {
          full_name: profile?.full_name || 'Unknown User',
          avatar_url: profile?.avatar_url || null,
        },
        timestamp: data.created_at,
        type: (data.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        sender_name: profile?.full_name || 'Unknown User',
        sender_avatar: profile?.avatar_url || null,
        read_by: [],
        receiver_id: undefined,
        read: false,
        attachment_data: null,
      };

      // Update cache
      await CacheService.addMessage(connectionId, chatMessage);

      return chatMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  static async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<boolean> {
    try {
      // For now, just return true as reactions need proper schema
      console.log('Adding reaction:', { messageId, userId, emoji });
      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  }

  static async removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<boolean> {
    try {
      // For now, just return true as reactions need proper schema
      console.log('Removing reaction:', { messageId, userId, emoji });
      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      return false;
    }
  }

  static async markAsRead(
    connectionId: string,
    userId: string,
    messageIds: string[]
  ): Promise<boolean> {
    try {
      // For now, just log the action - proper implementation needs schema updates
      console.log('Marking messages as read:', { connectionId, userId, messageIds });
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  static async deleteMessage(messageId: string, userId: string, connectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) {
        console.error('Error deleting message:', error);
        return false;
      }

      // Clear cache to force refresh (we don't have removeMessage method)
      await CacheService.invalidateChatCache(connectionId);

      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  }
}

// Export static class, no need for instance
