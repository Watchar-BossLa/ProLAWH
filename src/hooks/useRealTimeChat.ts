
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participant_count?: number;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  reactions: MessageReaction[];
  read_receipts: ReadReceipt[];
  reply_to?: ChatMessage;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  user_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface TypingIndicator {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  last_activity: string;
  user_profile?: {
    full_name?: string;
  };
}

export function useRealTimeChat(chatId?: string) {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatRoom | null>(null);

  // Fetch user's chat rooms with proper error handling
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      // First get chats where user is a participant
      const { data: participantChats, error: participantError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      if (!participantChats || participantChats.length === 0) {
        setChatRooms([]);
        return;
      }

      const chatIds = participantChats.map(p => p.chat_id);

      // Then get the chat details
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .in('id', chatIds)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;

      // Get participant counts and last messages for each chat
      const roomsWithMetadata = await Promise.all(
        (chats || []).map(async (chat) => {
          // Get participant count
          const { count: participantCount } = await supabase
            .from('chat_participants')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...chat,
            participant_count: participantCount || 0,
            last_message: lastMessage || null
          };
        })
      );

      setChatRooms(roomsWithMetadata);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    }
  }, [user]);

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async (roomId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          message_reactions(*),
          read_receipts(*, profiles:user_id(full_name, avatar_url))
        `)
        .eq('chat_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      // Get sender profiles separately
      const senderIds = [...new Set((messagesData || []).map(msg => msg.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds);

      const profileMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      const formattedMessages = (messagesData || []).map(msg => ({
        ...msg,
        sender_profile: profileMap[msg.sender_id] || null,
        reactions: msg.message_reactions || [],
        read_receipts: msg.read_receipts || [],
        reply_to: null // Will be populated if needed
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (content: string, messageType: 'text' | 'file' | 'image' = 'text', fileData?: { url: string; name: string; size: number }, replyToId?: string) => {
    if (!user || !chatId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content,
          message_type: messageType,
          file_url: fileData?.url,
          file_name: fileData?.name,
          file_size: fileData?.size,
          reply_to_id: replyToId
        });

      if (error) throw error;

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, chatId]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          reaction
        }, {
          onConflict: 'message_id,user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  }, [user]);

  // Remove reaction from message
  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', reaction);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [user]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('read_receipts')
        .upsert({
          message_id: messageId,
          user_id: user.id
        }, {
          onConflict: 'message_id,user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [user]);

  // Update typing indicator
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!user || !chatId) return;

    try {
      if (isTyping) {
        const { error } = await supabase
          .from('typing_indicators')
          .upsert({
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            last_activity: new Date().toISOString()
          }, {
            onConflict: 'chat_id,user_id'
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('typing_indicators')
          .delete()
          .eq('chat_id', chatId)
          .eq('user_id', user.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [user, chatId]);

  // Create or get direct chat
  const createDirectChat = useCallback(async (otherUserId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('create_direct_chat', {
        other_user_id: otherUserId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating direct chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive"
      });
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channels: any[] = [];

    // Subscribe to messages for current chat
    if (chatId) {
      const messagesChannel = supabase
        .channel(`messages_${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, () => {
          fetchMessages(chatId);
        })
        .subscribe();

      channels.push(messagesChannel);

      // Subscribe to typing indicators for current chat
      const typingChannel = supabase
        .channel(`typing_${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `chat_id=eq.${chatId}`
        }, async () => {
          const { data } = await supabase
            .from('typing_indicators')
            .select('*')
            .eq('chat_id', chatId)
            .eq('is_typing', true)
            .neq('user_id', user.id);

          // Get profiles for typing users
          if (data && data.length > 0) {
            const userIds = data.map(d => d.user_id);
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', userIds);

            const profileMap = (profiles || []).reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);

            setTypingUsers(data.map(indicator => ({
              ...indicator,
              user_profile: profileMap[indicator.user_id] || null
            })));
          } else {
            setTypingUsers([]);
          }
        })
        .subscribe();

      channels.push(typingChannel);

      // Subscribe to reactions for current chat
      const reactionsChannel = supabase
        .channel(`reactions_${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        }, () => {
          fetchMessages(chatId);
        })
        .subscribe();

      channels.push(reactionsChannel);
    }

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, chatId, fetchMessages]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user, fetchChatRooms]);

  // Load messages when chat changes
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      
      // Find current chat
      const chat = chatRooms.find(room => room.id === chatId);
      setCurrentChat(chat || null);
    }
  }, [chatId, fetchMessages, chatRooms]);

  return {
    chatRooms,
    messages,
    typingUsers,
    currentChat,
    isLoading,
    sendMessage,
    addReaction,
    removeReaction,
    markAsRead,
    updateTypingStatus,
    createDirectChat,
    refreshChatRooms: fetchChatRooms,
    refreshMessages: () => chatId && fetchMessages(chatId)
  };
}
