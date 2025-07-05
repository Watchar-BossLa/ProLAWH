import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ChatRoom } from './types';

export function useChatRooms() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_participants!inner(
            user_id,
            role,
            joined_at,
            is_muted
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match ChatRoom interface
      const transformedRooms: ChatRoom[] = (data || []).map(room => ({
        id: room.id,
        name: room.name,
        type: (room.type as 'direct' | 'group' | 'channel') || 'direct',
        description: room.description || '',
        avatar_url: room.avatar_url || '',
        created_by: room.created_by,
        is_private: room.is_private ?? true,
        max_members: room.max_members ?? 100,
        created_at: room.created_at,
        updated_at: room.updated_at,
        chat_participants: room.chat_participants.map((p: any) => ({
          id: `${room.id}-${p.user_id}`, // Generate ID since it might not exist
          chat_id: room.id,
          user_id: p.user_id,
          role: p.role || 'member',
          joined_at: p.joined_at,
          last_read_at: p.last_read_at || null,
          is_muted: p.is_muted || false
        }))
      }));

      setChatRooms(transformedRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createDirectChat = useCallback(async (otherUserId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Check if direct chat already exists
      const { data: existingChat } = await supabase
        .from('chat_participants')
        .select(`
          chat_id,
          chat_rooms!inner(
            id,
            type,
            chat_participants!inner(user_id)
          )
        `)
        .eq('user_id', user.id);

      // Find existing direct chat with this user
      const directChat = existingChat?.find(chat => 
        chat.chat_rooms.type === 'direct' &&
        chat.chat_rooms.chat_participants.some(p => p.user_id === otherUserId) &&
        chat.chat_rooms.chat_participants.length === 2
      );

      if (directChat) {
        return { data: directChat.chat_id, error: null };
      }

      // Create new direct chat
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'direct',
          created_by: user.id,
          is_private: true,
          max_members: 2
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add both participants
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert([
          { chat_id: newRoom.id, user_id: user.id, role: 'member' },
          { chat_id: newRoom.id, user_id: otherUserId, role: 'member' }
        ]);

      if (participantError) throw participantError;

      await fetchChatRooms();
      return { data: newRoom.id, error: null };
    } catch (error) {
      console.error('Error creating direct chat:', error);
      return { data: null, error: 'Failed to create chat' };
    }
  }, [user, fetchChatRooms]);

  const createGroupChat = useCallback(async (name: string, participantIds: string[]) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          type: 'group',
          created_by: user.id,
          is_private: true,
          max_members: 100
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as admin
      const participants = [
        { chat_id: newRoom.id, user_id: user.id, role: 'admin' },
        ...participantIds.map(id => ({
          chat_id: newRoom.id,
          user_id: id,
          role: 'member'
        }))
      ];

      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert(participants);

      if (participantError) throw participantError;

      await fetchChatRooms();
      return { data: newRoom.id, error: null };
    } catch (error) {
      console.error('Error creating group chat:', error);
      return { data: null, error: 'Failed to create group chat' };
    }
  }, [user, fetchChatRooms]);

  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user, fetchChatRooms]);

  // Set up realtime subscription for chat room updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat_rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        },
        () => {
          fetchChatRooms();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_participants'
        },
        () => {
          fetchChatRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchChatRooms]);

  return {
    chatRooms,
    isLoading,
    fetchChatRooms,
    createDirectChat,
    createGroupChat
  };
}
