
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface RealTimeMessage {
  id: string;
  content: string;
  sender_id: string;
  connection_id?: string;
  chat_room_id?: string;
  created_at: string;
  updated_at: string;
  message_type: string;
  file_name?: string;
  file_url?: string;
  reply_to_id?: string;
  reactions: Record<string, any>;
  read_by?: string[];
  sender_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_private?: boolean;
  member_count?: number;
  last_activity?: string;
  chat_participants: { user_id: string }[];
  last_message?: any;
}

export function useRealTimeMessaging() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages for current room
  const fetchMessages = useCallback(async (roomId?: string) => {
    if (!user || (!roomId && !currentRoom)) return;

    const targetRoom = roomId || currentRoom;
    setIsLoading(true);
    setError(null);

    try {
      // Try fetching from network_messages first (for direct messages)
      const { data: networkMessages, error: networkError } = await supabase
        .from('network_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (networkMessages && !networkError) {
        const formattedMessages: RealTimeMessage[] = networkMessages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          connection_id: msg.receiver_id,
          created_at: msg.created_at,
          updated_at: msg.created_at,
          message_type: 'text',
          file_name: msg.attachment_data?.file_name,
          file_url: msg.attachment_data?.file_url,
          reply_to_id: null,
          reactions: msg.reactions || {},
          sender_profile: Array.isArray(msg.sender_profile) ? msg.sender_profile[0] : msg.sender_profile
        }));
        setMessages(formattedMessages);
      } else {
        console.warn('Network messages not available, using fallback');
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentRoom]);

  // Send a message
  const sendMessage = useCallback(async (content: string, type: string = 'text', fileData?: any) => {
    if (!user || !currentRoom) return;

    try {
      const messageData = {
        content,
        sender_id: user.id,
        connection_id: currentRoom,
        message_type: type,
        ...(fileData && { 
          file_name: fileData.name,
          file_url: fileData.url 
        })
      };

      const { error } = await supabase
        .from('network_messages')
        .insert(messageData);

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      } else {
        // Refresh messages after sending
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, currentRoom, fetchMessages]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      // This would update read status if the field exists
      console.log('Marking message as read:', messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [user]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const currentReactions = message.reactions || {};
      const userReactions = currentReactions[user.id] || [];
      
      const updatedReactions = userReactions.includes(emoji)
        ? userReactions.filter((r: string) => r !== emoji)
        : [...userReactions, emoji];

      const newReactions = {
        ...currentReactions,
        [user.id]: updatedReactions
      };

      const { error } = await supabase
        .from('network_messages')
        .update({ reactions: newReactions })
        .eq('id', messageId);

      if (!error) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: newReactions }
            : msg
        ));
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  }, [user, messages]);

  // Fetch chat rooms
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      // For now, we'll create a simple room structure
      const mockRooms: ChatRoom[] = [
        {
          id: 'general',
          name: 'General',
          type: 'public',
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_private: false,
          member_count: 1,
          last_activity: new Date().toISOString(),
          chat_participants: [{ user_id: user.id }],
          last_message: null
        }
      ];

      setChatRooms(mockRooms);
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      setChatRooms([]);
    }
  }, [user]);

  // Join a room
  const joinRoom = useCallback((roomId: string) => {
    setCurrentRoom(roomId);
    fetchMessages(roomId);
  }, [fetchMessages]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || !currentRoom) return;

    const channel = supabase
      .channel(`messages:${currentRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.connection_id === currentRoom || 
              newMessage.sender_id === user.id || 
              newMessage.receiver_id === user.id) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentRoom, fetchMessages]);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user, fetchChatRooms]);

  return {
    messages,
    chatRooms,
    currentRoom,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    addReaction,
    joinRoom,
    fetchMessages,
    fetchChatRooms
  };
}
