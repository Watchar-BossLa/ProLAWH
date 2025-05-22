
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, SendMessageParams, MessageReactionsData } from '@/types/chat';

export function useSendMessage() {
  const sendMessage = async ({ content, sender_id, receiver_id, attachment_data }: SendMessageParams) => {
    try {
      const messageData = {
        sender_id,
        receiver_id,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachment_data: attachment_data || null,
        reactions: {} // Empty object for reactions initially
      };
      
      const { data, error } = await supabase
        .from('network_messages')
        .insert([messageData])
        .select();

      if (error) throw error;

      // Ensure we properly type the response
      const chatMessage: ChatMessage = {
        ...data[0],
        reactions: (data[0].reactions as any) || {} as MessageReactionsData
      };

      return chatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  return { sendMessage };
}
