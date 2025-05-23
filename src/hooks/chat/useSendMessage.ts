
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, SendMessageParams } from '@/types/chat';

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

      // Convert the database response to ChatMessage type
      const chatMessage: ChatMessage = {
        id: data[0].id,
        sender_id: data[0].sender_id,
        receiver_id: data[0].receiver_id,
        content: data[0].content,
        timestamp: data[0].timestamp,
        read: data[0].read,
        attachment_data: data[0].attachment_data,
        reactions: data[0].reactions as ChatMessage['reactions']
      };

      return chatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  return { sendMessage };
}
