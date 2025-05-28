
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from './chat/useChatRooms';
import { useChatMessages } from './chat/useChatMessages';
import { useChatReactions } from './chat/useChatReactions';
import { useChatTyping } from './chat/useChatTyping';

// Re-export types for backward compatibility
export type {
  ChatRoom,
  ChatMessage,
  MessageReaction,
  ReadReceipt,
  TypingIndicator
} from './chat/types';

export function useRealTimeChat(chatId?: string) {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState<any>(null);

  const {
    chatRooms,
    isLoading: roomsLoading,
    fetchChatRooms,
    createDirectChat
  } = useChatRooms();

  const {
    messages,
    isLoading: messagesLoading,
    fetchMessages,
    sendMessage: sendMessageBase,
    markAsRead,
    setMessages
  } = useChatMessages();

  const { addReaction, removeReaction } = useChatReactions(setMessages);
  const { typingUsers, updateTypingStatus } = useChatTyping();

  const isLoading = roomsLoading || messagesLoading;

  // Wrapper for sendMessage to match the original API
  const sendMessage = async (
    content: string,
    messageType: 'text' | 'file' | 'image' = 'text',
    fileData?: { url: string; name: string; size: number },
    replyToId?: string
  ) => {
    if (chatId) {
      await sendMessageBase(chatId, content, messageType, fileData, replyToId);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user, fetchChatRooms]);

  // Load messages when chat changes
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      
      // Find current chat
      const chat = chatRooms.find(room => room.id === chatId);
      setCurrentChat(chat || null);
    }
  }, [chatId, fetchMessages, chatRooms]);

  return {
    chatRooms,
    messages,
    typingUsers,
    currentChat,
    isLoading,
    sendMessage,
    addReaction,
    removeReaction,
    markAsRead,
    updateTypingStatus,
    createDirectChat,
    refreshChatRooms: fetchChatRooms,
    refreshMessages: () => chatId && fetchMessages(chatId)
  };
}
