
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
  TypingIndicator,
  SendMessageParams
} from './chat/types';

export function useRealTimeChat(chatId?: string) {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>('online');

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
    contentOrParams: string | { content: string; type: 'text' | 'file' | 'image'; file_url?: string; file_name?: string },
    messageType: 'text' | 'file' | 'image' = 'text',
    fileData?: { url: string; name: string; size: number },
    replyToId?: string
  ) => {
    if (!chatId) return;

    if (typeof contentOrParams === 'string') {
      // Legacy API support
      await sendMessageBase(chatId, contentOrParams, messageType, fileData, replyToId);
    } else {
      // New object-based API
      const { content, type, file_url, file_name } = contentOrParams;
      const fileInfo = file_url && file_name ? { url: file_url, name: file_name, size: 0 } : undefined;
      await sendMessageBase(chatId, content, type, fileInfo);
    }
  };

  // Mock implementation for typing indicator
  const sendTypingIndicator = async (isTyping: boolean) => {
    if (chatId) {
      updateTypingStatus(isTyping, chatId);
    }
  };

  // Mock implementation for file upload
  const uploadFile = async (file: File) => {
    // Mock implementation - return a fake URL
    return {
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    };
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
    onlineStatus,
    sendMessage,
    sendTypingIndicator,
    uploadFile,
    addReaction,
    removeReaction,
    markAsRead,
    updateTypingStatus,
    createDirectChat,
    refreshChatRooms: fetchChatRooms,
    refreshMessages: () => chatId && fetchMessages(chatId)
  };
}
