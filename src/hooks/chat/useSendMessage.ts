
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { SendMessageParams } from './types';

export function useSendMessage(connectionId: string) {
  const sendMessage = useCallback(async (params: SendMessageParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          connection_id: connectionId,
          sender_id: user.id,
          content: params.content,
          message_type: params.type,
          file_url: params.file_url,
          file_name: params.file_name,
          reply_to_id: params.reply_to
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
  }, [connectionId]);

  return { sendMessage };
}
