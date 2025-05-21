
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';

export function useMessageSearch(messages: ChatMessage[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);

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

  // Search function
  const searchMessages = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => setSearchQuery('');

  return { 
    searchQuery, 
    filteredMessages, 
    searchMessages, 
    clearSearch,
    hasSearchResults: searchQuery && filteredMessages.length > 0 
  };
}
