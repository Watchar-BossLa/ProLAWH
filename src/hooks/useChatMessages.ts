
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
          const newMessage = payload.new as any;
          const message: Message = {
            id: newMessage.id,
            chat_id: newMessage.chat_id,
            sender_id: newMessage.sender_id,
            content: newMessage.content,
            message_type: newMessage.message_type || 'text',
            file_url: newMessage.file_url,
            file_name: newMessage.file_name,
            reply_to_id: newMessage.reply_to_id,
            created_at: newMessage.created_at,
            reactions: newMessage.reactions || {}
          };
          
          setMessages(prev => [...prev, message]);
          
          // Fetch sender profile separately
          if (newMessage.sender_id) {
            fetchUserProfile(newMessage.sender_id, newMessage.id);
          }
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

  const fetchUserProfile = async (userId: string, messageId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (profile) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, profiles: profile }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (messagesData) {
        // Fetch reactions for each message
        const messagesWithReactions = await Promise.all(
          messagesData.map(async (message) => {
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

            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', message.sender_id)
              .single();

            return {
              id: message.id,
              chat_id: message.chat_id,
              sender_id: message.sender_id,
              content: message.content,
              message_type: message.message_type || 'text',
              file_url: message.file_url,
              file_name: message.file_name,
              reply_to_id: message.reply_to_id,
              created_at: message.created_at,
              reactions: groupedReactions,
              profiles: profile || undefined
            };
          })
        );

        setMessages(messagesWithReactions);
      }
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
