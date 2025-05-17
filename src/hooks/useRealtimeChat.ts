
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NetworkMessage } from '@/types/network';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface UseChatOptions {
  connectionId?: string;
}

export function useRealtimeChat({ connectionId }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<NetworkMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!connectionId || !user) return;

    setLoading(true);
    
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('network_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        
        const formattedMessages: NetworkMessage[] = data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          timestamp: msg.timestamp,
          read: msg.read,
          attachments: msg.attachment_data
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching messages'));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_messages',
          filter: `sender_id=eq.${connectionId},receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage: NetworkMessage = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            receiverId: payload.new.receiver_id,
            content: payload.new.content,
            timestamp: payload.new.timestamp,
            read: payload.new.read,
            attachments: payload.new.attachment_data
          };
          
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false);
        }
      )
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = channel.presenceState();
          const connectionPresence = Object.values(state).flat()
            .find((presence: any) => presence.user_id === connectionId);
          
          if (connectionPresence && connectionPresence.typing_to === user.id) {
            setIsTyping(true);
          } else {
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectionId, user]);

  // Send message function
  const sendMessage = async (content: string, attachments?: any[]) => {
    if (!connectionId || !user || !content.trim()) return null;
    
    try {
      const message = {
        sender_id: user.id,
        receiver_id: connectionId,
        content,
        attachment_data: attachments ? { items: attachments } : null
      };

      const { data, error } = await supabase
        .from('network_messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return null;
    }
  };

  // Update typing status
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!connectionId || !user) return;
    
    try {
      await supabase.channel('presence')
        .track({
          user_id: user.id,
          typing_to: isTyping ? connectionId : null,
          last_active: new Date().toISOString()
        });
    } catch (err) {
      console.error('Error updating typing status:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    isTyping,
    sendMessage,
    updateTypingStatus
  };
}
