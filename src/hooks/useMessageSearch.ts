
import { useState, useCallback } from 'react';
import { ChatMessage } from './chat/types';

export function useMessageSearch(messages: ChatMessage[]) {
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMessages = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simple text search in message content
      const results = messages.filter(message => 
        message.content?.toLowerCase().includes(query.toLowerCase()) ||
        message.sender_name?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching messages:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [messages]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isSearching,
    searchMessages,
    clearSearch
  };
}
