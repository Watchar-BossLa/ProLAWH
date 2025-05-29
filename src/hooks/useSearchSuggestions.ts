
import { useMemo } from 'react';
import { ChatMessage, SearchSuggestion } from './chat/types';

export function useSearchSuggestions(messages: ChatMessage[], currentQuery: string = '') {
  const suggestions = useMemo((): SearchSuggestion[] => {
    if (currentQuery.length < 2) return [];

    const userSuggestions = new Map<string, number>();
    const keywordSuggestions = new Map<string, number>();
    const fileSuggestions = new Map<string, number>();

    messages.forEach(message => {
      // User suggestions
      if (message.sender_name && message.sender_name.toLowerCase().includes(currentQuery.toLowerCase())) {
        userSuggestions.set(message.sender_name, (userSuggestions.get(message.sender_name) || 0) + 1);
      }

      // Content keyword suggestions
      const words = message.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2 && word.includes(currentQuery.toLowerCase())) {
          keywordSuggestions.set(word, (keywordSuggestions.get(word) || 0) + 1);
        }
      });

      // File suggestions
      if (message.file_name && message.file_name.toLowerCase().includes(currentQuery.toLowerCase())) {
        fileSuggestions.set(message.file_name, (fileSuggestions.get(message.file_name) || 0) + 1);
      }
    });

    const allSuggestions: SearchSuggestion[] = [];

    // Add user suggestions
    Array.from(userSuggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([user, count]) => {
        allSuggestions.push({
          id: `user-${user}`,
          type: 'user',
          value: `from:${user}`,
          label: `Messages from ${user}`,
          query: `from:${user}`,
          description: `Messages from ${user}`,
          count
        });
      });

    // Add keyword suggestions
    Array.from(keywordSuggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([keyword, count]) => {
        allSuggestions.push({
          id: `keyword-${keyword}`,
          type: 'keyword',
          value: keyword,
          label: keyword,
          query: keyword,
          description: keyword,
          count
        });
      });

    // Add file suggestions
    Array.from(fileSuggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([fileName, count]) => {
        allSuggestions.push({
          id: `file-${fileName}`,
          type: 'file',
          value: `file:${fileName}`,
          label: `File: ${fileName}`,
          query: `file:${fileName}`,
          description: `File: ${fileName}`,
          count
        });
      });

    return allSuggestions.slice(0, 10);
  }, [messages, currentQuery]);

  const getRecentSearches = () => {
    try {
      const recent = localStorage.getItem('chat-recent-searches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  };

  const saveRecentSearch = (query: string) => {
    try {
      const recent = getRecentSearches();
      const updated = [query, ...recent.filter((q: string) => q !== query)].slice(0, 5);
      localStorage.setItem('chat-recent-searches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  return {
    suggestions,
    getRecentSearches,
    saveRecentSearch
  };
}
