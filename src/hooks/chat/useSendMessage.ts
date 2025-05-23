
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, SendMessageParams, DatabaseMessage } from '@/types/chat';

export function useSendMessage() {
  const sendMessage = async ({ content, sender_id, receiver_id, attachment_data }: SendMessageParams) => {
    try {
      const messageData = {
        sender_id,
        receiver_id,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachment_data: attachment_data || null
      };
      
      const { data, error } = await supabase
        .from('network_messages')
        .insert([messageData])
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('No data returned from message insert');
      }

      // Convert the database response to ChatMessage type
      const dbMessage = data[0] as DatabaseMessage;
      const chatMessage: ChatMessage = {
        id: dbMessage.id,
        sender_id: dbMessage.sender_id,
        receiver_id: dbMessage.receiver_id,
        content: dbMessage.content,
        timestamp: dbMessage.timestamp,
        read: dbMessage.read,
        attachment_data: dbMessage.attachment_data,
        reactions: dbMessage.reactions as ChatMessage['reactions'] || {}
      };

      return chatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  return { sendMessage };
}
