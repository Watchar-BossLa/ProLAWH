
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reactions: Record<string, string[]>;
  thread_id?: string;
  reply_to?: string;
}

interface SendMessageParams {
  content: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to?: string;
}

export function useRealtimeChat(connectionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'away' | 'offline'>('offline');
  const [isLoading, setIsLoading] = useState(true);

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

        // Subscribe to typing indicators
        const typingChannel = supabase
          .channel(`typing:${connectionId}`)
          .on('presence', { event: 'sync' }, () => {
            const state = typingChannel.presenceState();
            const typing = Object.keys(state).filter(key => {
              const presence = state[key][0];
              return presence && presence.typing === true;
            });
            setTypingUsers(typing);
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            const presence = newPresences[0];
            if (presence && presence.typing) {
              setTypingUsers(prev => [...prev, key]);
            }
          })
          .on('presence', { event: 'leave' }, ({ key }) => {
            setTypingUsers(prev => prev.filter(user => user !== key));
          })
          .subscribe();

        // Subscribe to online status
        const presenceChannel = supabase
          .channel(`presence:${connectionId}`)
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            const isOnline = Object.keys(state).length > 1;
            setOnlineStatus(isOnline ? 'online' : 'offline');
          })
          .subscribe();

        return () => {
          messagesChannel.unsubscribe();
          typingChannel.unsubscribe();
          presenceChannel.unsubscribe();
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

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel(`typing:${connectionId}`);
      
      if (isTyping) {
        await channel.track({ typing: true, user_id: user.id });
      } else {
        await channel.untrack();
      }
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [connectionId]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const currentReactions = message.reactions || {};
      const emojiReactions = currentReactions[emoji] || [];
      
      let updatedReactions: Record<string, string[]>;
      
      if (emojiReactions.includes(user.id)) {
        // Remove reaction
        updatedReactions = {
          ...currentReactions,
          [emoji]: emojiReactions.filter(id => id !== user.id)
        };
        
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        // Add reaction
        updatedReactions = {
          ...currentReactions,
          [emoji]: [...emojiReactions, user.id]
        };
      }

      const { error } = await supabase
        .from('chat_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [messages]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const currentReactions = message.reactions || {};
      const emojiReactions = currentReactions[emoji] || [];
      
      const updatedReactions = {
        ...currentReactions,
        [emoji]: emojiReactions.filter(id => id !== user.id)
      };

      if (updatedReactions[emoji].length === 0) {
        delete updatedReactions[emoji];
      }

      const { error } = await supabase
        .from('chat_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [messages]);

  const uploadFile = useCallback(async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      await sendMessage({
        content: `Shared a file: ${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        file_url: publicUrl,
        file_name: file.name
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    }
  }, [sendMessage]);

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
