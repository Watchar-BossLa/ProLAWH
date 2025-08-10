
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '../types';

export class ChatRoomService {
  static async fetchChatRooms(userId: string): Promise<ChatRoom[]> {
    if (!userId) return [];

    try {
      const { data: connections, error } = await supabase
        .from('network_connections')
        .select('id, user_id, connected_user_id, created_at, updated_at')
        .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`);

      if (error) {
        console.error('Error fetching connections:', error);
        return [];
      }

      const counterpartIds = Array.from(
        new Set((connections || []).map((c: any) => (c.user_id === userId ? c.connected_user_id : c.user_id)))
      );

      // Batch fetch counterpart profiles
      let profileMap: Record<string, { full_name?: string; avatar_url?: string }> = {};
      if (counterpartIds.length) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', counterpartIds);
        profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
      }

      const rooms: ChatRoom[] = [];

      for (const conn of connections || []) {
        const counterpartId = conn.user_id === userId ? conn.connected_user_id : conn.user_id;

        // Get latest message between user and counterpart
        const { data: lastMsgs } = await supabase
          .from('network_messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${counterpartId}),and(sender_id.eq.${counterpartId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: false })
          .limit(1);
        const lastMsg = (lastMsgs && lastMsgs[0]) || null;

        const lastActivity = (lastMsg?.created_at as string) || conn.updated_at || conn.created_at;
        const profile = profileMap[counterpartId] || {};

        rooms.push({
          id: counterpartId,
          name: profile.full_name || 'Direct chat',
          type: 'direct',
          created_by: userId,
          created_at: conn.created_at,
          updated_at: conn.updated_at,
          is_private: true,
          member_count: 2,
          last_activity: lastActivity,
          chat_participants: [{ user_id: userId }, { user_id: counterpartId }],
          last_message: lastMsg || null,
        } as ChatRoom);
      }

      rooms.sort((a, b) =>
        new Date(b.last_activity || b.updated_at).getTime() - new Date(a.last_activity || a.updated_at).getTime()
      );

      return rooms;
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      return [];
    }
  }
}
