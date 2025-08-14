import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '@/hooks/chat/types';
import { CacheService } from './cacheService';

export class ChatRoomService {
  static async fetchChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      // Try cache first
      const cached = await CacheService.getNetworkConnections(userId);
      if (cached && cached.length > 0) {
        return cached;
      }

      // Fetch network connections which represent direct chat rooms
      const { data: connections, error } = await supabase
        .from('network_connections')
        .select(`
          id,
          user_id,
          connected_user_id,
          status,
          created_at,
          updated_at,
          user_profile:profiles!user_id(
            id,
            full_name,
            avatar_url
          ),
          connected_user_profile:profiles!connected_user_id(
            id,
            full_name,
            avatar_url
          ),
          last_message:chat_messages(
            id,
            content,
            message_type,
            created_at,
            sender_id
          )
        `)
        .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`)
        .eq('status', 'accepted')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const chatRooms: ChatRoom[] = (connections || []).map(conn => {
        const isCurrentUserInitiator = conn.user_id === userId;
        const otherUser = isCurrentUserInitiator ? conn.connected_user_profile : conn.user_profile;
        const lastMessage = Array.isArray(conn.last_message) ? conn.last_message[0] : conn.last_message;

        return {
          id: conn.id,
          name: otherUser?.full_name || 'Unknown User',
          type: 'direct' as const,
          description: 'Direct conversation',
          avatar_url: otherUser?.avatar_url,
          created_by: conn.user_id,
          is_private: true,
          max_members: 2,
          created_at: conn.created_at,
          updated_at: conn.updated_at,
          chat_participants: [],
          last_message: lastMessage ? {
            id: lastMessage.id,
            chat_id: conn.id,
            sender_id: lastMessage.sender_id,
            content: lastMessage.content,
            message_type: lastMessage.message_type || 'text',
            is_edited: false,
            is_pinned: false,
            metadata: {},
            created_at: lastMessage.created_at,
            updated_at: lastMessage.created_at,
            reactions: [],
            read_receipts: [],
            timestamp: lastMessage.created_at,
            type: lastMessage.message_type || 'text',
            read_by: []
          } : undefined
        };
      });

      // Cache the results
      await CacheService.setNetworkConnections(userId, chatRooms);

      return chatRooms;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      return [];
    }
  }

  static async createDirectChat(
    userId: string,
    otherUserId: string
  ): Promise<ChatRoom | null> {
    try {
      // Check if connection already exists
      const { data: existing } = await supabase
        .from('network_connections')
        .select('id')
        .or(
          `and(user_id.eq.${userId},connected_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},connected_user_id.eq.${userId})`
        )
        .single();

      if (existing) {
        // Return existing chat room
        const rooms = await this.fetchChatRooms(userId);
        return rooms.find(room => room.id === existing.id) || null;
      }

      // Create new connection
      const { data: connection, error } = await supabase
        .from('network_connections')
        .insert({
          user_id: userId,
          connected_user_id: otherUserId,
          status: 'accepted'
        })
        .select(`
          id,
          user_id,
          connected_user_id,
          created_at,
          updated_at,
          connected_user_profile:profiles!connected_user_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      const chatRoom: ChatRoom = {
        id: connection.id,
        name: connection.connected_user_profile?.full_name || 'Unknown User',
        type: 'direct',
        description: 'Direct conversation',
        avatar_url: connection.connected_user_profile?.avatar_url,
        created_by: connection.user_id,
        is_private: true,
        max_members: 2,
        created_at: connection.created_at,
        updated_at: connection.updated_at,
        chat_participants: []
      };

      // Invalidate cache
      await CacheService.invalidateUserCache(userId);
      await CacheService.invalidateUserCache(otherUserId);

      return chatRoom;
    } catch (error) {
      console.error('Error creating direct chat:', error);
      return null;
    }
  }

  static async getChatRoom(roomId: string): Promise<ChatRoom | null> {
    try {
      const { data: connection, error } = await supabase
        .from('network_connections')
        .select(`
          id,
          user_id,
          connected_user_id,
          status,
          created_at,
          updated_at,
          user_profile:profiles!user_id(
            id,
            full_name,
            avatar_url
          ),
          connected_user_profile:profiles!connected_user_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('id', roomId)
        .single();

      if (error) throw error;

      const chatRoom: ChatRoom = {
        id: connection.id,
        name: connection.connected_user_profile?.full_name || connection.user_profile?.full_name || 'Unknown User',
        type: 'direct',
        description: 'Direct conversation',
        avatar_url: connection.connected_user_profile?.avatar_url || connection.user_profile?.avatar_url,
        created_by: connection.user_id,
        is_private: true,
        max_members: 2,
        created_at: connection.created_at,
        updated_at: connection.updated_at,
        chat_participants: []
      };

      return chatRoom;
    } catch (error) {
      console.error('Error fetching chat room:', error);
      return null;
    }
  }
}