
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

export interface RealTimeMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'video_call' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  thread_id?: string;
  reactions: Record<string, string[]>;
  read_by: string[];
  created_at: string;
  updated_at: string;
  edited_at?: string;
  deleted_at?: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  description?: string;
  avatar_url?: string;
  created_by: string;
  is_private: boolean;
  member_count: number;
  last_message?: RealTimeMessage;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface TypingStatus {
  user_id: string;
  chat_room_id: string;
  is_typing: boolean;
  user_name: string;
  last_activity: string;
}

export function useRealTimeMessaging(chatRoomId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  const channelRef = useRef<any>(null);
  const presenceRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize real-time subscriptions
  useEffect(() => {
    if (!user || !chatRoomId) return;

    const initializeRealTime = async () => {
      try {
        // Set up main messaging channel
        channelRef.current = supabase
          .channel(`chat_room:${chatRoomId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `chat_room_id=eq.${chatRoomId}`
            },
            (payload) => {
              const newMessage = payload.new as RealTimeMessage;
              setMessages(prev => [...prev, newMessage]);
              
              // Mark as read if it's not from current user
              if (newMessage.sender_id !== user.id) {
                markMessageAsRead(newMessage.id);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'chat_messages',
              filter: `chat_room_id=eq.${chatRoomId}`
            },
            (payload) => {
              const updatedMessage = payload.new as RealTimeMessage;
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === updatedMessage.id ? updatedMessage : msg
                )
              );
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'chat_messages',
              filter: `chat_room_id=eq.${chatRoomId}`
            },
            (payload) => {
              const deletedMessage = payload.old as RealTimeMessage;
              setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
            } else {
              setIsConnected(false);
            }
          });

        // Set up presence for online users and typing indicators
        presenceRef.current = supabase
          .channel(`presence:${chatRoomId}`)
          .on('presence', { event: 'sync' }, () => {
            const state = presenceRef.current.presenceState();
            const users = new Set<string>();
            const typing: TypingStatus[] = [];
            
            Object.keys(state).forEach(userId => {
              const presences = state[userId];
              if (presences.length > 0) {
                users.add(userId);
                const presence = presences[0];
                if (presence.is_typing) {
                  typing.push({
                    user_id: userId,
                    chat_room_id: chatRoomId,
                    is_typing: true,
                    user_name: presence.user_name || 'Unknown User',
                    last_activity: presence.last_activity
                  });
                }
              }
            });
            
            setOnlineUsers(users);
            setTypingUsers(typing);
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('User joined:', key, newPresences);
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('User left:', key, leftPresences);
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              // Track user presence
              await presenceRef.current.track({
                user_id: user.id,
                user_name: user.user_metadata?.full_name || 'Unknown User',
                online_at: new Date().toISOString(),
                is_typing: false,
                last_activity: new Date().toISOString()
              });
            }
          });

      } catch (error) {
        console.error('Error initializing real-time messaging:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to real-time messaging",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeRealTime();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (presenceRef.current) {
        supabase.removeChannel(presenceRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user, chatRoomId]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            sender_profile:profiles!sender_id(full_name, avatar_url)
          `)
          .eq('chat_room_id', chatRoomId)
          .is('deleted_at', null)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_messages', chat_room_id: chatRoomId }
    );

    if (data) {
      setMessages(data);
    }
  }, [chatRoomId]);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    messageType: 'text' | 'file' | 'image' = 'text',
    fileData?: { url: string; name: string; size: number },
    replyToId?: string,
    threadId?: string
  ) => {
    if (!user || !chatRoomId || (!content.trim() && !fileData)) return;

    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            chat_room_id: chatRoomId,
            sender_id: user.id,
            content: content.trim(),
            message_type: messageType,
            file_url: fileData?.url,
            file_name: fileData?.name,
            file_size: fileData?.size,
            reply_to_id: replyToId,
            thread_id: threadId,
            reactions: {},
            read_by: [user.id]
          });

        if (error) throw error;
      },
      { operation: 'send_message', chat_room_id: chatRoomId }
    );

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [user, chatRoomId]);

  // Update typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!presenceRef.current || !user) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    await presenceRef.current.track({
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Unknown User',
      online_at: new Date().toISOString(),
      is_typing: isTyping,
      last_activity: new Date().toISOString()
    });

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, 3000);
    }
  }, [user]);

  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    const { error } = await handleAsyncError(
      async () => {
        const { data: message, error: fetchError } = await supabase
          .from('chat_messages')
          .select('read_by')
          .eq('id', messageId)
          .single();

        if (fetchError) throw fetchError;

        const readBy = message.read_by || [];
        if (!readBy.includes(user.id)) {
          const { error: updateError } = await supabase
            .from('chat_messages')
            .update({ 
              read_by: [...readBy, user.id] 
            })
            .eq('id', messageId);

          if (updateError) throw updateError;
        }
      },
      { operation: 'mark_as_read', message_id: messageId }
    );
  }, [user]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    const { error } = await handleAsyncError(
      async () => {
        const { data: message, error: fetchError } = await supabase
          .from('chat_messages')
          .select('reactions')
          .eq('id', messageId)
          .single();

        if (fetchError) throw fetchError;

        const reactions = message.reactions || {};
        const emojiReactions = reactions[emoji] || [];
        
        let updatedReactions;
        if (emojiReactions.includes(user.id)) {
          // Remove reaction
          updatedReactions = {
            ...reactions,
            [emoji]: emojiReactions.filter(id => id !== user.id)
          };
          if (updatedReactions[emoji].length === 0) {
            delete updatedReactions[emoji];
          }
        } else {
          // Add reaction
          updatedReactions = {
            ...reactions,
            [emoji]: [...emojiReactions, user.id]
          };
        }

        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({ reactions: updatedReactions })
          .eq('id', messageId);

        if (updateError) throw updateError;
      },
      { operation: 'add_reaction', message_id: messageId, emoji }
    );
  }, [user]);

  // Fetch chat rooms
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select(`
            *,
            chat_participants!inner(user_id),
            last_message:chat_messages(
              id, content, message_type, created_at,
              sender_profile:profiles!sender_id(full_name)
            )
          `)
          .eq('chat_participants.user_id', user.id)
          .order('last_activity', { ascending: false });

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_chat_rooms' }
    );

    if (data) {
      setChatRooms(data);
    }
  }, [user]);

  // Initialize
  useEffect(() => {
    fetchMessages();
    fetchChatRooms();
  }, [fetchMessages, fetchChatRooms]);

  return {
    messages,
    chatRooms,
    typingUsers: typingUsers.filter(t => t.user_id !== user?.id),
    onlineUsers,
    isConnected,
    isLoading,
    sendMessage,
    updateTypingStatus,
    markMessageAsRead,
    addReaction,
    fetchMessages,
    fetchChatRooms
  };
}
