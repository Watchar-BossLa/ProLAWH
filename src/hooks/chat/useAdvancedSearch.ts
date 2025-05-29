
import { useMemo } from 'react';
import { ChatMessage, SearchSuggestion } from './types';
import { useSearchFilters } from './useSearchFilters';
import { useMessageSearch } from './useMessageSearch';
import { useSearchSuggestions } from '../useSearchSuggestions';

interface UseAdvancedSearchProps {
  messages: ChatMessage[];
  onSearch?: (query: string) => void;
}

export function useAdvancedSearch({ messages, onSearch }: UseAdvancedSearchProps) {
  const { filters, updateFilters, clearFilters } = useSearchFilters();
  
  const {
    query,
    searchResults,
    highlightedMessages,
    isSearchActive,
    hasResults,
    totalResults,
    updateQuery: updateSearchQuery,
    clearSearch: clearSearchQuery
  } = useMessageSearch({ messages, filters });

  const { suggestions } = useSearchSuggestions(messages, query);

  const updateQuery = (newQuery: string) => {
    updateSearchQuery(newQuery);
    onSearch?.(newQuery);
  };

  const clearSearch = () => {
    clearSearchQuery();
    clearFilters();
  };

  return {
    query,
    filters,
    searchResults,
    suggestions,
    highlightedMessages,
    isSearchActive,
    hasResults,
    totalResults,
    updateQuery,
    updateFilters,
    clearSearch
  };
}
