
import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { ChatMessage, SearchFilters } from './types';

interface UseMessageSearchProps {
  messages: ChatMessage[];
  filters: SearchFilters;
}

export function useMessageSearch({ messages, filters }: UseMessageSearchProps) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(messages, {
      keys: [
        { name: 'content', weight: 2 },
        { name: 'sender_name', weight: 1.5 },
        { name: 'file_name', weight: 1 }
      ],
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true
    });
  }, [messages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (filters.messageType) {
      filtered = filtered.filter(msg => msg.type === filters.messageType);
    }

    if (filters.sender) {
      filtered = filtered.filter(msg => 
        msg.sender_name?.toLowerCase().includes(filters.sender!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(msg => {
        const msgDate = new Date(msg.timestamp);
        return msgDate >= start && msgDate <= end;
      });
    }

    if (filters.hasAttachments) {
      filtered = filtered.filter(msg => msg.file_url);
    }

    if (filters.hasReactions) {
      filtered = filtered.filter(msg => 
        msg.reactions && Object.keys(msg.reactions).length > 0
      );
    }

    if (filters.hasReplies) {
      filtered = filtered.filter(msg => msg.reply_to_id);
    }

    return filtered;
  }, [messages, filters]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTarget = filteredMessages.length < messages.length ? filteredMessages : messages;
    const results = fuse.search(query, { limit: 50 });

    return results.map(result => ({
      message: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));
  }, [query, fuse, filteredMessages, messages]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const highlightedMessages = useMemo(() => {
    if (!query.trim()) return messages;
    return searchResults.map(result => result.message);
  }, [query, messages, searchResults]);

  return {
    query,
    searchResults,
    highlightedMessages,
    isSearchActive: !!query.trim(),
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length,
    updateQuery,
    clearSearch
  };
}
