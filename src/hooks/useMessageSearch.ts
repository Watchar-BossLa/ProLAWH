import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import { ChatMessage } from '@/hooks/useRealTimeChat';

export interface SearchFilters {
  sender?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  messageType?: 'text' | 'file' | 'image' | 'all';
  hasReactions?: boolean;
  hasReplies?: boolean;
}

export interface SearchResult {
  message: ChatMessage;
  score: number;
  matches: FuseResult<ChatMessage>['matches'];
}

const fuseOptions = {
  keys: [
    { name: 'content', weight: 0.8 },
    { name: 'sender_name', weight: 0.2 },
    { name: 'file_name', weight: 0.3 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true
};

export function useMessageSearch(messages: ChatMessage[]) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fuse = useMemo(() => new Fuse(messages, fuseOptions), [messages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (filters.sender) {
      filtered = filtered.filter(msg => 
        msg.sender_name.toLowerCase().includes(filters.sender!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter(msg => {
        const msgDate = new Date(msg.timestamp);
        return msgDate >= filters.dateRange!.start && msgDate <= filters.dateRange!.end;
      });
    }

    if (filters.messageType && filters.messageType !== 'all') {
      filtered = filtered.filter(msg => msg.type === filters.messageType);
    }

    if (filters.hasReactions) {
      filtered = filtered.filter(msg => 
        Object.keys(msg.reactions || {}).length > 0
      );
    }

    if (filters.hasReplies) {
      filtered = filtered.filter(msg => 
        messages.some(m => m.reply_to === msg.id)
      );
    }

    return filtered;
  }, [messages, filters]);

  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const searchableMessages = filteredMessages.length > 0 ? filteredMessages : messages;
    const results = fuse.search(query, { limit: 50 });

    return results.map(result => ({
      message: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));
  }, [query, filteredMessages, messages, fuse]);

  const highlightedMessages = useMemo(() => {
    if (!query.trim() || !isSearchActive) return messages;
    return searchResults.map(result => result.message);
  }, [query, isSearchActive, messages, searchResults]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setIsSearchActive(newQuery.trim().length > 0);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setIsSearchActive(false);
    setFilters({});
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    query,
    updateQuery,
    filters,
    updateFilters,
    searchResults,
    highlightedMessages,
    isSearchActive,
    clearSearch,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length
  };
}
