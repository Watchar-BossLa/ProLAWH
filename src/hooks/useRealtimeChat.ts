
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Reaction {
  emoji: string;
  user_id: string;
  created_at: string;
}

type MessageReactionsData = {
  [emoji: string]: Reaction[];
};

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment_data?: any;
  reactions?: MessageReactionsData;
}

interface SendMessageParams {
  content: string;
  sender_id: string;
  receiver_id: string;
  attachment_data?: any;
}

export function useRealtimeChat(recipientId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!recipientId || !user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('network_messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
          .order('timestamp', { ascending: true });

        if (error) throw error;

        setMessages(data as ChatMessage[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_messages',
          filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${recipientId}),and(sender_id=eq.${recipientId},receiver_id=eq.${user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark message as read if it's incoming
          if (newMessage.sender_id === recipientId && !newMessage.read) {
            markAsRead(newMessage.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'network_messages',
          filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${recipientId}),and(sender_id=eq.${recipientId},receiver_id=eq.${user.id}))`
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    // Mark all unread messages as read when opening the chat
    const markAllAsRead = async () => {
      try {
        await supabase
          .from('network_messages')
          .update({ read: true })
          .match({ 
            sender_id: recipientId,
            receiver_id: user.id,
            read: false
          });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAllAsRead();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, user]);

  // Filter messages based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMessages(messages);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = messages.filter(message => 
      message.content.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredMessages(filtered);
  }, [messages, searchQuery]);

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('network_messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

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

      return data[0] as ChatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  const reactToMessage = async (messageId: string, emoji: string) => {
    if (!user) return;
    
    try {
      // Find the message to update
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate) return;
      
      // Create a copy of the reactions
      const updatedReactions = { ...(messageToUpdate.reactions || {}) };
      
      // Check if user already reacted with this emoji
      const hasUserReactedWithEmoji = updatedReactions[emoji]?.some(
        reaction => reaction.user_id === user.id
      );
      
      if (hasUserReactedWithEmoji) {
        // Remove the reaction
        updatedReactions[emoji] = updatedReactions[emoji].filter(
          reaction => reaction.user_id !== user.id
        );
        
        // Remove empty emoji arrays
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        // Remove user reaction from any other emoji
        Object.keys(updatedReactions).forEach(existingEmoji => {
          updatedReactions[existingEmoji] = updatedReactions[existingEmoji].filter(
            reaction => reaction.user_id !== user.id
          );
          
          if (updatedReactions[existingEmoji].length === 0) {
            delete updatedReactions[existingEmoji];
          }
        });
        
        // Add the new reaction
        if (!updatedReactions[emoji]) {
          updatedReactions[emoji] = [];
        }
        
        updatedReactions[emoji].push({
          emoji,
          user_id: user.id,
          created_at: new Date().toISOString()
        });
      }
      
      // Update the message in the database - fix for the TypeScript error
      const { error } = await supabase
        .from('network_messages')
        .update({ 
          reactions: updatedReactions as any  // Type assertion to fix build error
        })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: updatedReactions } 
            : msg
        )
      );
      
    } catch (error) {
      console.error('Error updating message reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  // Search function
  const searchMessages = (query: string) => {
    setSearchQuery(query);
  };

  return { 
    messages: filteredMessages.length > 0 || searchQuery ? filteredMessages : messages, 
    sendMessage, 
    isLoading, 
    reactToMessage, 
    searchMessages,
    searchQuery,
    setSearchQuery,
    hasSearchResults: searchQuery && filteredMessages.length > 0,
    clearSearch: () => setSearchQuery('')
  };
}
