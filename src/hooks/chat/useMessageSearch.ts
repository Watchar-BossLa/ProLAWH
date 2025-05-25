
import { useState, useMemo } from 'react';
import { ChatMessage } from './types';

export function useMessageSearch(messages: ChatMessage[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    
    return messages.filter(message =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredMessages
  };
}
