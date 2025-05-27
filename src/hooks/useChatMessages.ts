
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content?: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  reply_to_id?: string;
  created_at: string;
  reactions?: Record<string, string[]>;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface SendMessageParams {
  content: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  reply_to_id?: string;
}

export function useChatMessages(chatId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;
    
    fetchMessages();
  }, [chatId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Fetch sender profile if not available
          if (!newMessage.profiles) {
            fetchMessageWithProfile(newMessage.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
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
          event: 'UPDATE',
          schema: 'public',
          table: 'message_reactions'
        },
        () => {
          // Refresh messages when reactions change
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            full_name,
            avatar_url
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch reactions for each message
      const messagesWithReactions = await Promise.all(
        (data || []).map(async (message) => {
          const { data: reactions } = await supabase
            .from('message_reactions')
            .select('reaction, user_id')
            .eq('message_id', message.id);

          // Group reactions by emoji
          const groupedReactions: Record<string, string[]> = {};
          reactions?.forEach(({ reaction, user_id }) => {
            if (!groupedReactions[reaction]) {
              groupedReactions[reaction] = [];
            }
            groupedReactions[reaction].push(user_id);
          });

          return {
            ...message,
            reactions: groupedReactions
          };
        })
      );

      setMessages(messagesWithReactions);
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
  };

  const fetchMessageWithProfile = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            full_name,
            avatar_url
          )
        `)
        .eq('id', messageId)
        .single();

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, profiles: data.profiles } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching message profile:', error);
    }
  };

  const sendMessage = useCallback(async (params: SendMessageParams) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: params.content,
          message_type: params.message_type,
          file_url: params.file_url,
          file_name: params.file_name,
          reply_to_id: params.reply_to_id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, chatId]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      // Check if user already reacted with this emoji
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', emoji)
        .single();

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction: emoji
          });

        if (error) throw error;
      }

      // Refresh messages to update reactions
      fetchMessages();
    } catch (error) {
      console.error('Error managing reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    }
  }, [user, fetchMessages]);

  return {
    messages,
    isLoading,
    isOnline,
    sendMessage,
    addReaction,
    refetchMessages: fetchMessages
  };
}
