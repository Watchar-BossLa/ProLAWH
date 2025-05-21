
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/types/chat';
import { useMessageFetching } from './chat/useMessageFetching';
import { useSendMessage } from './chat/useSendMessage';
import { useMessageReactions } from './chat/useMessageReactions';
import { useMessageSearch } from './chat/useMessageSearch';

export function useRealtimeChat(recipientId: string | null) {
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  // Use the extracted hooks
  const { messages: fetchedMessages, isLoading, markAsRead } = useMessageFetching(recipientId, user?.id || null);
  const { sendMessage } = useSendMessage();
  const { reactToMessage } = useMessageReactions(allMessages, setAllMessages);
  const { 
    searchQuery, 
    filteredMessages, 
    searchMessages, 
    clearSearch, 
    hasSearchResults 
  } = useMessageSearch(allMessages);

  // Update local state when fetched messages change
  useEffect(() => {
    if (fetchedMessages) {
      setAllMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Wrapper for reactToMessage that includes user ID
  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (user) {
      reactToMessage(messageId, emoji, user.id);
    }
  };

  return { 
    messages: filteredMessages.length > 0 || searchQuery ? filteredMessages : allMessages, 
    sendMessage, 
    isLoading, 
    reactToMessage: handleReactToMessage, 
    searchMessages,
    searchQuery,
    setSearchQuery: searchMessages,
    hasSearchResults,
    clearSearch
  };
}
