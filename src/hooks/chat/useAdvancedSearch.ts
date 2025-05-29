
import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { ChatMessage, SearchFilters, SearchResult, SearchSuggestion } from './types';

interface UseAdvancedSearchProps {
  messages: ChatMessage[];
  onSearch?: (query: string) => void;
}

export function useAdvancedSearch({ messages, onSearch }: UseAdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Initialize Fuse.js with optimized configuration
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

  // Apply filters to messages
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

  // Perform fuzzy search
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const searchTarget = filteredMessages.length < messages.length ? filteredMessages : messages;
    const results = fuse.search(query, { limit: 50 });

    return results.map(result => ({
      message: result.item,
      score: result.score || 0,
      matches: result.matches || []
    })).filter(result => {
      // Apply filters to search results if not already applied
      if (filteredMessages.length === messages.length) {
        return applyFiltersToMessage(result.message, filters);
      }
      return true;
    });
  }, [query, fuse, filteredMessages, messages, filters]);

  // Generate smart suggestions
  const suggestions = useMemo((): SearchSuggestion[] => {
    if (query.length < 2) {
      // Return recent searches when no query
      return searchHistory.slice(0, 5).map((search, index) => ({
        id: `recent-${index}`,
        type: 'recent' as const,
        value: search,
        label: search,
        query: search,
        description: `Recent search`
      }));
    }

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // User suggestions
    const users = new Set<string>();
    messages.forEach(msg => {
      if (msg.sender_name && msg.sender_name.toLowerCase().includes(queryLower)) {
        users.add(msg.sender_name);
      }
    });

    Array.from(users).slice(0, 3).forEach((user, index) => {
      suggestions.push({
        id: `user-${index}`,
        type: 'user' as const,
        value: user,
        label: `Messages from ${user}`,
        query: `from:${user}`,
        description: `Filter by ${user}`
      });
    });

    // File suggestions
    const files = new Set<string>();
    messages.forEach(msg => {
      if (msg.file_name && msg.file_name.toLowerCase().includes(queryLower)) {
        files.add(msg.file_name);
      }
    });

    Array.from(files).slice(0, 3).forEach((file, index) => {
      suggestions.push({
        id: `file-${index}`,
        type: 'file' as const,
        value: file,
        label: `File: ${file}`,
        query: file,
        description: `Search in files`
      });
    });

    // Keyword suggestions
    const keywords = new Set<string>();
    messages.forEach(msg => {
      const words = msg.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3 && word.includes(queryLower)) {
          keywords.add(word);
        }
      });
    });

    Array.from(keywords).slice(0, 5).forEach((keyword, index) => {
      suggestions.push({
        id: `keyword-${index}`,
        type: 'keyword' as const,
        value: keyword,
        label: keyword,
        query: keyword,
        description: `Search for "${keyword}"`
      });
    });

    return suggestions.slice(0, 10);
  }, [query, messages, searchHistory]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setIsSearchActive(!!newQuery.trim());
    onSearch?.(newQuery);

    // Add to search history if it's a meaningful search
    if (newQuery.trim() && newQuery.length > 2) {
      setSearchHistory(prev => {
        const updated = [newQuery, ...prev.filter(q => q !== newQuery)];
        return updated.slice(0, 10); // Keep only 10 recent searches
      });
    }
  }, [onSearch]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setIsSearchActive(false);
  }, []);

  const highlightedMessages = useMemo(() => {
    if (!isSearchActive) return messages;
    return searchResults.map(result => result.message);
  }, [isSearchActive, messages, searchResults]);

  return {
    query,
    filters,
    searchResults,
    suggestions,
    highlightedMessages,
    isSearchActive,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length,
    updateQuery,
    updateFilters,
    clearSearch
  };
}

function applyFiltersToMessage(message: ChatMessage, filters: SearchFilters): boolean {
  if (filters.messageType && message.type !== filters.messageType) return false;
  
  if (filters.sender && !message.sender_name?.toLowerCase().includes(filters.sender.toLowerCase())) {
    return false;
  }
  
  if (filters.dateRange) {
    const msgDate = new Date(message.timestamp);
    if (msgDate < filters.dateRange.start || msgDate > filters.dateRange.end) {
      return false;
    }
  }
  
  if (filters.hasAttachments && !message.file_url) return false;
  if (filters.hasReactions && (!message.reactions || Object.keys(message.reactions).length === 0)) return false;
  if (filters.hasReplies && !message.reply_to_id) return false;
  
  return true;
}
