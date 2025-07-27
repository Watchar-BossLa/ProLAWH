
import { useState, useCallback } from 'react';
import { ChatMessage, SearchFilters } from './chat/types';

export interface SearchResult {
  message: ChatMessage;
  score: number;
  matches: any[];
}

export function useMessageSearch(messages: ChatMessage[]) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMessages = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simple text search in message content
      const results = messages
        .filter(message => {
          let matches = message.content?.toLowerCase().includes(query.toLowerCase()) ||
                       message.sender_name?.toLowerCase().includes(query.toLowerCase());
          
          // Apply filters if provided
          if (filters && matches) {
            if (filters.messageType && message.message_type !== filters.messageType) {
              matches = false;
            }
            if (filters.sender && !message.sender_name?.toLowerCase().includes(filters.sender.toLowerCase())) {
              matches = false;
            }
            if (filters.hasAttachments && !message.file_url) {
              matches = false;
            }
          }
          
          return matches;
        })
        .map(message => ({
          message,
          score: 1,
          matches: []
        }));

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

// Re-export types for backward compatibility
export type { SearchFilters } from './chat/types';
