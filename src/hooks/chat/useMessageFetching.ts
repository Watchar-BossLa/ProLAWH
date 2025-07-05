
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, DatabaseMessage } from './types';

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

        // Convert database messages to ChatMessage type
        const chatMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          chat_id: `${msg.sender_id}-${msg.receiver_id}`, // Generate chat_id for compatibility
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.content || '', // Ensure content is never undefined
          message_type: 'text',
          timestamp: msg.timestamp,
          created_at: msg.timestamp,
          updated_at: msg.timestamp,
          type: 'text',
          read: msg.read,
          attachment_data: msg.attachment_data,
          reactions: [], // Convert to proper MessageReaction[] format
          read_receipts: [],
          is_edited: false,
          is_pinned: false,
          metadata: {},
          sender_profile: {
            full_name: 'Unknown User'
          }
        }));

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
          const newMsg = payload.new as DatabaseMessage;
          const newMessage: ChatMessage = {
            id: newMsg.id,
            chat_id: `${newMsg.sender_id}-${newMsg.receiver_id}`,
            sender_id: newMsg.sender_id,
            receiver_id: newMsg.receiver_id,
            content: newMsg.content || '', // Ensure content is never undefined
            message_type: 'text',
            timestamp: newMsg.timestamp,
            created_at: newMsg.timestamp,
            updated_at: newMsg.timestamp,
            type: 'text',
            read: newMsg.read,
            attachment_data: newMsg.attachment_data,
            reactions: [], // Convert to proper MessageReaction[] format
            read_receipts: [],
            is_edited: false,
            is_pinned: false,
            metadata: {},
            sender_profile: {
              full_name: 'Unknown User'
            }
          };
          
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
          const updatedMsg = payload.new as DatabaseMessage;
          const updatedMessage: ChatMessage = {
            id: updatedMsg.id,
            chat_id: `${updatedMsg.sender_id}-${updatedMsg.receiver_id}`,
            sender_id: updatedMsg.sender_id,
            receiver_id: updatedMsg.receiver_id,
            content: updatedMsg.content || '', // Ensure content is never undefined
            message_type: 'text',
            timestamp: updatedMsg.timestamp,
            created_at: updatedMsg.timestamp,
            updated_at: updatedMsg.timestamp,
            type: 'text',
            read: updatedMsg.read,
            attachment_data: updatedMsg.attachment_data,
            reactions: [], // Convert to proper MessageReaction[] format
            read_receipts: [],
            is_edited: false,
            is_pinned: false,
            metadata: {},
            sender_profile: {
              full_name: 'Unknown User'
            }
          };
          
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
