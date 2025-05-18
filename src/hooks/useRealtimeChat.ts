
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NetworkMessage } from '@/types/network';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Define types for Supabase payload data
interface SupabaseMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  created_at: string;
  attachment_data: any; // Using any here since the Json type from Supabase can vary
}

interface PresenceState {
  user_id: string;
  typing_to: string | null;
  last_active: string;
  presence_ref?: string; // From the presenceState() return type
}

interface UseChatOptions {
  connectionId?: string;
}

/**
 * Process attachment data safely from Supabase format to NetworkMessage format
 */
const processAttachments = (attachmentData: any) => {
  if (!attachmentData) return undefined;
  
  try {
    // Check if attachmentData has items property and it's an array
    if (attachmentData.items && Array.isArray(attachmentData.items)) {
      return attachmentData.items;
    }
    return undefined;
  } catch (error) {
    console.error('Error processing attachment data:', error);
    return undefined;
  }
};

/**
 * Hook for real-time chat functionality using Supabase
 */
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
        
        const formattedMessages: NetworkMessage[] = (data as SupabaseMessage[]).map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          timestamp: msg.timestamp,
          read: msg.read,
          attachments: processAttachments(msg.attachment_data)
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
          const newMsg = payload.new as SupabaseMessage;
          const newMessage: NetworkMessage = {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            receiverId: newMsg.receiver_id,
            content: newMsg.content,
            timestamp: newMsg.timestamp,
            read: newMsg.read,
            attachments: processAttachments(newMsg.attachment_data)
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
          // Cast to unknown first as a safe type conversion practice
          const typingUsers = Object.values(state).flat() as unknown as PresenceState[];
          
          // Find the connection user in the presence state
          const connectionPresence = typingUsers.find((presence) => 
            presence && typeof presence === 'object' && 
            'user_id' in presence && presence.user_id === connectionId && 
            'typing_to' in presence && presence.typing_to === user.id
          );
          
          setIsTyping(!!connectionPresence);
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
