
import { useState, useCallback } from 'react';
import { SearchSuggestion } from './chat/types';

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = useCallback(async (query: string, context?: string) => {
    setIsLoading(true);
    try {
      // Mock suggestions based on query
      const mockSuggestions: SearchSuggestion[] = [
        {
          id: '1',
          text: `Search for "${query}"`,
          type: 'keyword',
          query,
          value: query,
          count: 42
        },
        {
          id: '2',
          text: 'Recent searches',
          type: 'recent',
          query: 'recent',
          value: 'recent',
          description: 'Your recent search history'
        },
        {
          id: '3',
          text: 'Popular topics',
          type: 'popular',
          query: 'popular',
          value: 'popular',
          description: 'Trending discussions'
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    generateSuggestions,
    clearSuggestions
  };
}
