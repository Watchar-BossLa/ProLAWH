
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

  // Fetch user's chat rooms
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          chat_participants!inner(user_id),
          messages(
            id,
            content,
            created_at,
            sender_id,
            message_type
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const roomsWithLastMessage = data?.map(room => ({
        ...room,
        participant_count: room.chat_participants?.length || 0,
        last_message: room.messages?.[room.messages.length - 1] || null
      })) || [];

      setChatRooms(roomsWithLastMessage);
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
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id(full_name, avatar_url),
          message_reactions(*),
          read_receipts(*, profiles:user_id(full_name, avatar_url)),
          reply_to:reply_to_id(id, content, sender_id, profiles:sender_id(full_name))
        `)
        .eq('chat_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        ...msg,
        sender_profile: msg.profiles,
        reactions: msg.message_reactions || [],
        read_receipts: msg.read_receipts || [],
        reply_to: msg.reply_to
      })) || [];

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

    // Subscribe to chat rooms changes
    const roomsChannel = supabase
      .channel('chat_rooms')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats'
      }, () => {
        fetchChatRooms();
      })
      .subscribe();

    channels.push(roomsChannel);

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
            .select(`
              *,
              profiles:user_id(full_name)
            `)
            .eq('chat_id', chatId)
            .eq('is_typing', true)
            .neq('user_id', user.id);

          setTypingUsers(data?.map(indicator => ({
            ...indicator,
            user_profile: indicator.profiles
          })) || []);
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
  }, [user, chatId, fetchChatRooms, fetchMessages]);

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
