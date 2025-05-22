
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, DatabaseMessage, MessageReactionsData } from '@/types/chat';

export function useMessageFetching(recipientId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!recipientId || !userId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('network_messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`)
          .order('timestamp', { ascending: true });

        if (error) throw error;

        // Convert the database messages to ChatMessage format
        const chatMessages = data.map(msg => {
          // Ensure reactions is properly typed
          const reactions = (msg.reactions as any) || {};
          
          return {
            ...msg,
            reactions
          } as ChatMessage;
        });

        setMessages(chatMessages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_messages',
          filter: `or(and(sender_id=eq.${userId},receiver_id=eq.${recipientId}),and(sender_id=eq.${recipientId},receiver_id=eq.${userId}))`
        },
        (payload) => {
          const newMsg = payload.new;
          // Ensure reactions is properly typed
          const newMessage = {
            ...newMsg,
            reactions: (newMsg.reactions as any) || {}
          } as ChatMessage;
          
          setMessages(prev => [...prev, newMessage]);
          
          // Mark message as read if it's incoming
          if (newMessage.sender_id === recipientId && !newMessage.read) {
            markAsRead(newMessage.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'network_messages',
          filter: `or(and(sender_id=eq.${userId},receiver_id=eq.${recipientId}),and(sender_id=eq.${recipientId},receiver_id=eq.${userId}))`
        },
        (payload) => {
          const updatedMsg = payload.new;
          // Ensure reactions is properly typed
          const updatedMessage = {
            ...updatedMsg,
            reactions: (updatedMsg.reactions as any) || {}
          } as ChatMessage;
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    // Mark all unread messages as read when opening the chat
    const markAllAsRead = async () => {
      try {
        await supabase
          .from('network_messages')
          .update({ read: true })
          .match({ 
            sender_id: recipientId,
            receiver_id: userId,
            read: false
          });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAllAsRead();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, userId]);

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('network_messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return { messages, isLoading, markAsRead };
}
