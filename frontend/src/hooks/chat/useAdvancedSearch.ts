
import { useMemo } from 'react';
import { ChatMessage, SearchSuggestion } from './types';
import { useSearchFilters } from './useSearchFilters';
import { useMessageSearch } from '../useMessageSearch';
import { useSearchSuggestions } from '../useSearchSuggestions';

interface UseAdvancedSearchProps {
  messages: ChatMessage[];
  onSearch?: (query: string) => void;
}

export function useAdvancedSearch({ messages, onSearch }: UseAdvancedSearchProps) {
  const { filters, updateFilters, clearFilters } = useSearchFilters();
  
  const {
    searchResults,
    isSearching,
    searchMessages,
    clearSearch: clearSearchQuery
  } = useMessageSearch(messages);

  const { suggestions } = useSearchSuggestions();

  const query = ''; // This should be managed by parent component
  const isSearchActive = searchResults.length > 0;
  const hasResults = searchResults.length > 0;
  const totalResults = searchResults.length;
  const highlightedMessages = searchResults.map(result => result.message);

  const updateQuery = (newQuery: string) => {
    searchMessages(newQuery, filters);
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
