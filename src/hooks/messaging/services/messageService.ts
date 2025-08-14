
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, SendMessageParams } from '../types';
import { cacheService } from './cacheService';

export class MessageService {
  async fetchMessages(
    connectionId: string, 
    limit: number = 50,
    before?: string
  ): Promise<ChatMessage[]> {
    try {
      // Check cache first
      const cachedMessages = await cacheService.getMessages(connectionId);
      if (cachedMessages.length > 0) {
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

      // Transform to ChatMessage format
      const chatMessages = (messages || []).map(msg => ({
        id: msg.id,
        chat_id: connectionId,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: (msg.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        file_url: msg.file_url,
        file_name: msg.file_name,
        reply_to_id: msg.reply_to_id,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        connection_id: msg.connection_id,
        read_by: msg.read_by || '[]',
        reactions: {},
        read_receipts: [],
        sender_profile: msg.profiles ? {
          full_name: msg.profiles.full_name || 'Unknown User',
          avatar_url: msg.profiles.avatar_url
        } : undefined,
        timestamp: msg.created_at,
        type: (msg.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        sender_name: msg.profiles?.full_name || 'Unknown User',
        sender_avatar: msg.profiles?.avatar_url
      })) as ChatMessage[];

      // Cache the messages
      await cacheService.cacheMessages(connectionId, chatMessages);

      return chatMessages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      return [];
    }
  }

  async sendMessage(
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
        file_url: params.fileData?.url,
        file_name: params.fileData?.name,
        reply_to_id: params.replyToId
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messageData)
        .select(`
          *,
          profiles:sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // Transform to ChatMessage format
      const chatMessage: ChatMessage = {
        id: data.id,
        chat_id: connectionId,
        sender_id: data.sender_id,
        content: data.content,
        message_type: (data.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        file_url: data.file_url,
        file_name: data.file_name,
        reply_to_id: data.reply_to_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        connection_id: data.connection_id,
        read_by: data.read_by || '[]',
        reactions: {},
        read_receipts: [],
        sender_profile: data.profiles ? {
          full_name: data.profiles.full_name || 'Unknown User',
          avatar_url: data.profiles.avatar_url
        } : undefined,
        timestamp: data.created_at,
        type: (data.message_type as 'text' | 'file' | 'image' | 'video' | 'voice' | 'system') || 'text',
        sender_name: data.profiles?.full_name || 'Unknown User',
        sender_avatar: data.profiles?.avatar_url
      };

      // Update cache
      await cacheService.addMessage(connectionId, chatMessage);

      return chatMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  async addReaction(
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

  async removeReaction(
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

  async markAsRead(
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

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
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

      // Remove from cache
      await cacheService.removeMessage(messageId);

      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  }
}

export const messageService = new MessageService();
