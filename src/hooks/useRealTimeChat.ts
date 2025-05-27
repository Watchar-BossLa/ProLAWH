
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  reactions?: MessageReaction[];
  sender_name?: string;
  sender_avatar?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface TypingUser {
  user_id: string;
  user_name?: string;
  last_activity: string;
}

export function useRealTimeChat(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          message_reactions (*)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles for messages
      const senderIds = [...new Set(data?.map(msg => msg.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const messagesWithProfiles: Message[] = data?.map(msg => ({
        ...msg,
        message_type: (msg.message_type as 'text' | 'file' | 'image' | 'system') || 'text',
        content: msg.content || '',
        sender_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown User',
        sender_avatar: profilesMap.get(msg.sender_id)?.avatar_url,
        reactions: msg.message_reactions || []
      })) || [];

      setMessages(messagesWithProfiles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [chatId]);

  // Send message
  const sendMessage = useCallback(async (content: string, messageType: 'text' | 'file' | 'image' = 'text', fileData?: { url: string; name: string; size: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const messageData = {
        chat_id: chatId,
        sender_id: user.id,
        content,
        message_type: messageType,
        ...(fileData && {
          file_url: fileData.url,
          file_name: fileData.name,
          file_size: fileData.size
        })
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      // Clear typing indicator
      await updateTypingStatus(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [chatId]);

  // Add reaction
  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          reaction
        }, {
          onConflict: 'message_id,user_id,reaction'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  }, []);

  // Remove reaction
  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .match({
          message_id: messageId,
          user_id: user.id,
          reaction
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast({
        title: "Error",
        description: "Failed to remove reaction",
        variant: "destructive"
      });
    }
  }, []);

  // Update typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('typing_indicators')
        .upsert({
          chat_id: chatId,
          user_id: user.id,
          is_typing: isTyping,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'chat_id,user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [chatId]);

  // Upload file
  const uploadFile = useCallback(async (file: File): Promise<{ url: string; name: string; size: number } | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${chatId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      return {
        url: data.publicUrl,
        name: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
      return null;
    }
  }, [chatId]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!chatId) return;

    let messagesSubscription: any;
    let reactionsSubscription: any;
    let typingSubscription: any;

    const setupSubscriptions = async () => {
      // Messages subscription
      messagesSubscription = supabase
        .channel(`messages:${chatId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, async (payload) => {
          const newMessage = payload.new as any;
          
          // Fetch sender profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const formattedMessage: Message = {
            ...newMessage,
            message_type: (newMessage.message_type as 'text' | 'file' | 'image' | 'system') || 'text',
            content: newMessage.content || '',
            sender_name: profile?.full_name || 'Unknown User',
            sender_avatar: profile?.avatar_url,
            reactions: []
          };

          setMessages(prev => [...prev, formattedMessage]);
        })
        .subscribe();

      // Reactions subscription
      reactionsSubscription = supabase
        .channel(`reactions:${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        }, (payload) => {
          const reaction = payload.new as MessageReaction;
          
          if (payload.eventType === 'INSERT') {
            setMessages(prev => prev.map(msg => 
              msg.id === reaction.message_id 
                ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
                : msg
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedReaction = payload.old as MessageReaction;
            setMessages(prev => prev.map(msg => 
              msg.id === deletedReaction.message_id 
                ? { ...msg, reactions: (msg.reactions || []).filter(r => r.id !== deletedReaction.id) }
                : msg
            ));
          }
        })
        .subscribe();

      // Typing indicators subscription
      typingSubscription = supabase
        .channel(`typing:${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `chat_id=eq.${chatId}`
        }, async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const indicator = payload.new as any;
            if (indicator.is_typing) {
              // Fetch user profile for typing indicator
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', indicator.user_id)
                .single();

              setTypingUsers(prev => {
                const existing = prev.find(u => u.user_id === indicator.user_id);
                const typingUser: TypingUser = {
                  user_id: indicator.user_id,
                  user_name: profile?.full_name || 'User',
                  last_activity: indicator.last_activity
                };

                if (existing) {
                  return prev.map(u => 
                    u.user_id === indicator.user_id ? typingUser : u
                  );
                }
                return [...prev, typingUser];
              });
            } else {
              setTypingUsers(prev => prev.filter(u => u.user_id !== indicator.user_id));
            }
          }
        })
        .subscribe();

      setIsConnected(true);
    };

    setupSubscriptions();
    fetchMessages();

    // Cleanup function
    return () => {
      if (messagesSubscription) supabase.removeChannel(messagesSubscription);
      if (reactionsSubscription) supabase.removeChannel(reactionsSubscription);
      if (typingSubscription) supabase.removeChannel(typingSubscription);
      setIsConnected(false);
    };
  }, [chatId, fetchMessages]);

  // Clean up typing indicators on unmount
  useEffect(() => {
    return () => {
      updateTypingStatus(false);
    };
  }, [updateTypingStatus]);

  return {
    messages,
    typingUsers,
    isLoading,
    isConnected,
    sendMessage,
    addReaction,
    removeReaction,
    updateTypingStatus,
    uploadFile
  };
}
