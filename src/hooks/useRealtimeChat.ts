import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ChatMessage, SendMessageParams } from './chat/types';
import { useSendMessage } from './chat/useSendMessage';
import { useMessageReactions } from './chat/useMessageReactions';
import { useTypingIndicator } from './chat/useTypingIndicator';
import { useFileUpload } from './chat/useFileUpload';
import { useOnlineStatus } from './chat/useOnlineStatus';

export function useRealtimeChat(connectionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { sendMessage } = useSendMessage(connectionId);
  const { addReaction, removeReaction } = useMessageReactions(messages);
  const { typingUsers, sendTypingIndicator } = useTypingIndicator(connectionId);
  const { uploadFile } = useFileUpload(sendMessage);
  const { onlineStatus } = useOnlineStatus(connectionId);

  // Initialize chat and subscribe to real-time updates
  useEffect(() => {
    if (!connectionId) return;

    const initializeChat = async () => {
      try {
        // Fetch existing messages from chat_messages table
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('connection_id', connectionId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        // Get sender profiles separately
        const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id) || [])];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', senderIds);

        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const formattedMessages: ChatMessage[] = messagesData?.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          sender_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown',
          sender_avatar: profilesMap.get(msg.sender_id)?.avatar_url,
          timestamp: msg.created_at,
          type: (msg.message_type as 'text' | 'file' | 'image') || 'text',
          file_url: msg.file_url || undefined,
          file_name: msg.file_name || undefined,
          reactions: (msg.reactions as Record<string, string[]>) || {},
          reply_to: msg.reply_to_id || undefined
        })) || [];

        setMessages(formattedMessages);
        setIsLoading(false);

        // Subscribe to new messages
        const messagesChannel = supabase
          .channel(`chat:${connectionId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `connection_id=eq.${connectionId}`
            },
            async (payload) => {
              const newMessage = payload.new as any;
              
              // Get sender profile
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', newMessage.sender_id)
                .single();

              setMessages(prev => [...prev, {
                id: newMessage.id,
                content: newMessage.content,
                sender_id: newMessage.sender_id,
                sender_name: profile?.full_name || 'User',
                sender_avatar: profile?.avatar_url,
                timestamp: newMessage.created_at,
                type: newMessage.message_type || 'text',
                file_url: newMessage.file_url,
                file_name: newMessage.file_name,
                reactions: newMessage.reactions || {},
                reply_to: newMessage.reply_to_id
              }]);
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'chat_messages',
              filter: `connection_id=eq.${connectionId}`
            },
            (payload) => {
              const updatedMessage = payload.new as any;
              setMessages(prev => prev.map(msg => 
                msg.id === updatedMessage.id 
                  ? { ...msg, reactions: updatedMessage.reactions || {} }
                  : msg
              ));
            }
          )
          .subscribe();

        return () => {
          messagesChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [connectionId]);

  const markAsRead = useCallback(async () => {
    // Placeholder for read status tracking
  }, []);

  return {
    messages,
    typingUsers,
    onlineStatus,
    isLoading,
    sendMessage,
    sendTypingIndicator,
    uploadFile,
    addReaction,
    removeReaction,
    markAsRead
  };
}
