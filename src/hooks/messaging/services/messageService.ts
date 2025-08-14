import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, SendMessageParams } from '@/hooks/chat/types';
import { CacheService } from './cacheService';

export class MessageService {
  static async fetchMessages(
    connectionId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatMessage[]> {
    try {
      // Try cache first for recent messages (offset 0)
      if (offset === 0) {
        const cached = await CacheService.getChatMessages(connectionId);
        if (cached && cached.length > 0) {
          return cached;
        }
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const messages = (data || []).map(msg => ({
        id: msg.id,
        chat_id: connectionId,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: msg.message_type || 'text',
        file_url: msg.file_url,
        file_name: msg.file_name,
        reply_to_id: msg.reply_to_id,
        is_edited: false,
        is_pinned: false,
        metadata: {},
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        reactions: [],
        read_receipts: [],
        sender_profile: msg.sender_profile ? {
          full_name: msg.sender_profile.full_name || 'Unknown User',
          avatar_url: msg.sender_profile.avatar_url
        } : undefined,
        timestamp: msg.created_at,
        type: msg.message_type || 'text',
        read_by: []
      })) as unknown as ChatMessage[];

      // Cache recent messages
      if (offset === 0 && messages.length > 0) {
        await CacheService.setChatMessages(connectionId, messages);
      }

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  static async sendMessage(
    connectionId: string,
    senderId: string,
    params: SendMessageParams
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          connection_id: connectionId,
          sender_id: senderId,
          content: params.content,
          message_type: params.type || 'text',
          file_url: params.file_url,
          file_name: params.file_name,
          reply_to_id: params.reply_to_id || params.reply_to,
        })
        .select(`
          *,
          sender_profile:profiles!sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      const message: ChatMessage = {
        id: data.id,
        chat_id: connectionId,
        sender_id: data.sender_id,
        content: data.content,
        message_type: data.message_type || 'text',
        file_url: data.file_url,
        file_name: data.file_name,
        reply_to_id: data.reply_to_id,
        is_edited: false,
        is_pinned: false,
        metadata: {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        reactions: [],
        read_receipts: [],
        sender_profile: data.sender_profile ? {
          full_name: data.sender_profile.full_name || 'Unknown User',
          avatar_url: data.sender_profile.avatar_url
        } : undefined,
        timestamp: data.created_at,
        type: data.message_type || 'text',
        read_by: data.read_by || []
      };

      // Update cache
      await CacheService.addMessage(connectionId, message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  static async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('reaction', emoji)
        .single();

      if (existing) {
        // Remove existing reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Add new reaction
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            reaction: emoji
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error handling reaction:', error);
      return false;
    }
  }

  static async markAsRead(
    connectionId: string,
    userId: string,
    messageIds: string[]
  ): Promise<boolean> {
    try {
      // Since we don't have the mark_messages_as_read function, update read_by field
      const { error } = await supabase
        .from('chat_messages')
        .update({ 
          read_by: supabase.raw(`array_append(read_by, '${userId}')`) 
        })
        .in('id', messageIds)
        .eq('connection_id', connectionId);

      if (error) throw error;

      // Invalidate cache to get fresh read status
      await CacheService.invalidateChatCache(connectionId);

      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }
}