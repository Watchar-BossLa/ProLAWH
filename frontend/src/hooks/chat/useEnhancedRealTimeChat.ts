import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  connection_id: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  read_by: string[];
  reactions: { emoji: string; user_id: string; created_at: string }[];
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface TypingIndicator {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  updated_at?: string;
  user_profile?: {
    full_name: string;
  };
}

export interface PresenceStatus {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
}

interface UseEnhancedRealTimeChatProps {
  chatId?: string;
}

export function useEnhancedRealTimeChat({ chatId }: UseEnhancedRealTimeChatProps = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [presenceData, setPresenceData] = useState<Map<string, PresenceStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  
  const messageChannel = useRef<any>(null);
  const typingChannel = useRef<any>(null);
  const presenceChannel = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async (targetChatId?: string) => {
    if (!targetChatId && !chatId) return;
    
    const currentChatId = targetChatId || chatId;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .eq('connection_id', currentChatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file',
        reactions: Array.isArray(msg.reactions) ? 
          msg.reactions.map((r: any) => ({
            emoji: r.emoji || '',
            user_id: r.user_id || '',
            created_at: r.created_at || new Date().toISOString()
          })) : [],
        read_by: Array.isArray(msg.read_by) ? 
          msg.read_by.filter((id: any) => typeof id === 'string') : [],
        status: msg.status as 'sending' | 'sent' | 'delivered' | 'read',
        sender_profile: msg.sender_profile && typeof msg.sender_profile === 'object' && !Array.isArray(msg.sender_profile) && 'full_name' in msg.sender_profile ? {
          full_name: (msg.sender_profile as any).full_name || 'Unknown User',
          avatar_url: (msg.sender_profile as any).avatar_url || undefined,
        } : {
          full_name: 'Unknown User',
        },
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      if (user && formattedMessages?.length) {
        await markMessagesAsRead(formattedMessages.map(m => m.id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatId, user, toast]);

  // Send message
  const sendMessage = useCallback(async (params: {
    content: string;
    type?: 'text' | 'image' | 'file';
    file_url?: string;
    file_name?: string;
    reply_to_id?: string;
  }) => {
    if (!user || !chatId) return;

    const { content, type = 'text', file_url, file_name, reply_to_id } = params;

    // Optimistic update
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      sender_id: user.id,
      connection_id: chatId,
      message_type: type,
      file_url,
      file_name,
      status: 'sending',
      read_by: [],
      reactions: [],
      reply_to_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender_profile: {
        full_name: user.user_metadata?.full_name || 'You',
      },
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          sender_id: user.id,
          connection_id: chatId,
          message_type: type,
          file_url,
          file_name,
          reply_to_id,
          status: 'sent',
        })
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Replace temp message with real one
      const formattedMessage: ChatMessage = {
        ...data,
        message_type: data.message_type as 'text' | 'image' | 'file',
        reactions: Array.isArray(data.reactions) ? 
          data.reactions.map((r: any) => ({
            emoji: r.emoji || '',
            user_id: r.user_id || '',
            created_at: r.created_at || new Date().toISOString()
          })) : [],
        read_by: Array.isArray(data.read_by) ? 
          data.read_by.filter((id: any) => typeof id === 'string') : [],
        status: data.status as 'sending' | 'sent' | 'delivered' | 'read',
        sender_profile: data.sender_profile && typeof data.sender_profile === 'object' && !Array.isArray(data.sender_profile) && 'full_name' in data.sender_profile ? {
          full_name: (data.sender_profile as any).full_name || 'Unknown User',
          avatar_url: (data.sender_profile as any).avatar_url || undefined,
        } : {
          full_name: 'Unknown User',
        },
      };
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? formattedMessage : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [user, chatId, toast]);

  // Add reaction
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    // Optimistic update
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const newReaction = { emoji, user_id: user.id, created_at: new Date().toISOString() };
        return {
          ...msg,
          reactions: [...msg.reactions.filter(r => !(r.user_id === user.id && r.emoji === emoji)), newReaction]
        };
      }
      return msg;
    }));

    try {
      // Update reactions in database
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const updatedReactions = [
          ...message.reactions.filter(r => !(r.user_id === user.id && r.emoji === emoji)),
          { emoji, user_id: user.id, created_at: new Date().toISOString() }
        ];

        await supabase
          .from('chat_messages')
          .update({ reactions: updatedReactions })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Revert optimistic update
      fetchMessages();
    }
  }, [user, messages, fetchMessages]);

  // Remove reaction
  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    // Optimistic update
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: msg.reactions.filter(r => !(r.user_id === user.id && r.emoji === emoji))
        };
      }
      return msg;
    }));

    try {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const updatedReactions = message.reactions.filter(r => !(r.user_id === user.id && r.emoji === emoji));

        await supabase
          .from('chat_messages')
          .update({ reactions: updatedReactions })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
      fetchMessages();
    }
  }, [user, messages, fetchMessages]);

  // Update typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!user || !chatId) return;

    try {
      if (isTyping) {
        await supabase
          .from('chat_typing_indicators')
          .upsert({
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            updated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 10000).toISOString(), // 10 seconds
          });
      } else {
        await supabase
          .from('chat_typing_indicators')
          .delete()
          .eq('chat_id', chatId)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }

    // Auto-clear typing after timeout
    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, 8000);
    }
  }, [user, chatId]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || !messageIds.length) return;

    try {
      // Update read_by array for each message
      for (const messageId of messageIds) {
        const { data: existingMessage } = await supabase
          .from('chat_messages')
          .select('read_by')
          .eq('id', messageId)
          .single();

        if (existingMessage) {
          const currentReadBy = Array.isArray(existingMessage.read_by) ? existingMessage.read_by : [];
          if (!currentReadBy.includes(user.id)) {
            await supabase
              .from('chat_messages')
              .update({
                read_by: [...currentReadBy, user.id],
                status: 'read'
              })
              .eq('id', messageId);
          }
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!chatId || !user) return;

    setConnectionStatus('connecting');

    // Messages subscription
    messageChannel.current = supabase
      .channel(`chat-messages-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `connection_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const rawMessage = payload.new as any;
            const newMessage: ChatMessage = {
              ...rawMessage,
              message_type: rawMessage.message_type as 'text' | 'image' | 'file',
              reactions: Array.isArray(rawMessage.reactions) ? 
                rawMessage.reactions.map((r: any) => ({
                  emoji: r.emoji || '',
                  user_id: r.user_id || '',
                  created_at: r.created_at || new Date().toISOString()
                })) : [],
              read_by: Array.isArray(rawMessage.read_by) ? 
                rawMessage.read_by.filter((id: any) => typeof id === 'string') : [],
              status: rawMessage.status as 'sending' | 'sent' | 'delivered' | 'read',
            };
            
            setMessages(prev => {
              // Avoid duplicates and replace temp messages
              const filtered = prev.filter(msg => 
                msg.id !== newMessage.id && 
                !(msg.id.startsWith('temp-') && msg.content === newMessage.content)
              );
              return [...filtered, newMessage];
            });
          } else if (payload.eventType === 'UPDATE') {
            const rawMessage = payload.new as any;
            const updatedMessage: ChatMessage = {
              ...rawMessage,
              message_type: rawMessage.message_type as 'text' | 'image' | 'file',
              reactions: Array.isArray(rawMessage.reactions) ? 
                rawMessage.reactions.map((r: any) => ({
                  emoji: r.emoji || '',
                  user_id: r.user_id || '',
                  created_at: r.created_at || new Date().toISOString()
                })) : [],
              read_by: Array.isArray(rawMessage.read_by) ? 
                rawMessage.read_by.filter((id: any) => typeof id === 'string') : [],
              status: rawMessage.status as 'sending' | 'sent' | 'delivered' | 'read',
            };
            
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected');
        }
      });

    // Typing indicators subscription
    typingChannel.current = supabase
      .channel(`chat-typing-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_typing_indicators',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const typingData = payload.new as TypingIndicator;
            if (typingData.user_id !== user.id && typingData.is_typing) {
              setTypingUsers(prev => {
                const filtered = prev.filter(t => t.user_id !== typingData.user_id);
                return [...filtered, typingData];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const typingData = payload.old as TypingIndicator;
            setTypingUsers(prev => prev.filter(t => t.user_id !== typingData.user_id));
          }
        }
      )
      .subscribe();

    // Presence subscription
    presenceChannel.current = supabase
      .channel(`chat-presence-${chatId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.current.presenceState();
        const presenceMap = new Map<string, PresenceStatus>();
        
        Object.entries(newState).forEach(([userId, presences]: [string, any[]]) => {
          if (presences.length > 0) {
            presenceMap.set(userId, presences[0] as unknown as PresenceStatus);
          }
        });
        
        setPresenceData(presenceMap);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setPresenceData(prev => {
          const newMap = new Map(prev);
          if (newPresences[0]) {
            newMap.set(key, newPresences[0] as unknown as PresenceStatus);
          }
          return newMap;
        });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setPresenceData(prev => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.current.track({
            user_id: user.id,
            status: 'online',
            last_seen: new Date().toISOString(),
          });
        }
      });

    // Initial load
    fetchMessages();

    return () => {
      if (messageChannel.current) {
        supabase.removeChannel(messageChannel.current);
      }
      if (typingChannel.current) {
        supabase.removeChannel(typingChannel.current);
      }
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, user, fetchMessages]);

  // Clean up typing indicators periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(user => {
          const expires = new Date(user.updated_at || 0).getTime() + 10000;
          return expires > now;
        })
      );
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    messages,
    typingUsers: typingUsers.filter(t => t.chat_id === chatId),
    presenceData,
    isLoading,
    connectionStatus,
    sendMessage,
    addReaction,
    removeReaction,
    updateTypingStatus,
    markMessagesAsRead,
    fetchMessages,
  };
}