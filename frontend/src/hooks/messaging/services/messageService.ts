
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RealTimeMessage, SendMessageParams } from '../types';

export class MessageService {
  static async fetchMessages(userId: string, currentRoom?: string): Promise<RealTimeMessage[]> {
    if (!userId || !currentRoom) return [];

    try {
      const { data: networkMessages, error: networkError } = await supabase
        .from('network_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${currentRoom}),and(sender_id.eq.${currentRoom},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (networkMessages && !networkError) {
        const formattedMessages: RealTimeMessage[] = networkMessages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          connection_id: currentRoom,
          created_at: msg.created_at,
          updated_at: msg.created_at,
          message_type: 'text',
          file_name: msg.attachment_data?.file_name,
          file_url: msg.attachment_data?.file_url,
          reply_to_id: null,
          reactions: msg.reactions || {},
          sender_profile: Array.isArray(msg.sender_profile) ? msg.sender_profile[0] : msg.sender_profile
        }));
        return formattedMessages;
      } else {
        console.warn('Network messages not available, using fallback');
        return [];
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  }

  static async sendMessage(userId: string, currentRoom: string, params: SendMessageParams): Promise<boolean> {
    if (!userId || !currentRoom) return false;

    try {
      const messageData = {
        content: params.content,
        sender_id: userId,
        receiver_id: currentRoom,
        ...(params.fileData && { 
          attachment_data: {
            file_name: params.fileData.name,
            file_url: params.fileData.url
          }
        })
      };

      const { error } = await supabase
        .from('network_messages')
        .insert(messageData);

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  }

  static async addReaction(messageId: string, emoji: string, userId: string, currentReactions: any): Promise<Record<string, any> | null> {
    try {
      const userReactions = currentReactions[userId] || [];
      
      const updatedReactions = userReactions.includes(emoji)
        ? userReactions.filter((r: string) => r !== emoji)
        : [...userReactions, emoji];

      const newReactions = {
        ...currentReactions,
        [userId]: updatedReactions
      };

      const { error } = await supabase
        .from('network_messages')
        .update({ reactions: newReactions })
        .eq('id', messageId);

      if (!error) {
        return newReactions;
      }
      return null;
    } catch (err) {
      console.error('Error adding reaction:', err);
      return null;
    }
  }
}
