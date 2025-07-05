
import { useState, useCallback, useMemo } from 'react';
import { searchService, type SearchOptions, type SearchResult } from '@/services/searchService';
import type { Opportunity } from '@/types/marketplace';

interface UseAdvancedSearchProps {
  data: Opportunity[];
  initialFilters?: Partial<SearchOptions>;
}

export function useAdvancedSearch({ data, initialFilters = {} }: UseAdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Omit<SearchOptions, 'query'>>({
    sortBy: 'relevance',
    ...initialFilters
  });
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: Omit<SearchOptions, 'query'> }>>([]);

  const searchOptions: SearchOptions = useMemo(() => ({
    query: searchQuery,
    ...filters
  }), [searchQuery, filters]);

  const searchResults: SearchResult<Opportunity>[] = useMemo(() => {
    return searchService.searchOpportunities(data, searchOptions);
  }, [data, searchOptions]);

  const sortedResults = useMemo(() => {
    let sorted = [...searchResults];

    switch (filters.sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.item.created_at).getTime() - new Date(a.item.created_at).getTime());
        break;
      case 'greenScore':
        sorted.sort((a, b) => b.item.green_score - a.item.green_score);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.item.title.localeCompare(b.item.title));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance from search service
        break;
    }

    return sorted;
  }, [searchResults, filters.sortBy]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<Omit<SearchOptions, 'query'>>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      sortBy: 'relevance'
    });
    setSearchQuery('');
  }, []);

  const saveCurrentFilters = useCallback((name: string) => {
    const filterToSave = { name, filters };
    setSavedFilters(prev => [...prev, filterToSave]);
  }, [filters]);

  const loadSavedFilter = useCallback((savedFilter: Omit<SearchOptions, 'query'>) => {
    setFilters(savedFilter);
  }, []);

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    data.forEach(item => {
      item.skills_required.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [data]);

  const searchStats = useMemo(() => {
    const total = data.length;
    const filtered = searchResults.length;
    const hasActiveFilters = Object.values(filters).some(value => 
      value !== undefined && value !== false && value !== 0 && 
      (Array.isArray(value) ? value.length > 0 : true)
    ) || searchQuery.trim() !== '';

    return {
      total,
      filtered,
      hasActiveFilters,
      filterReduction: total > 0 ? Math.round(((total - filtered) / total) * 100) : 0
    };
  }, [data.length, searchResults.length, filters, searchQuery]);

  return {
    // State
    searchQuery,
    filters,
    searchResults: sortedResults,
    savedFilters,
    availableSkills,
    searchStats,

    // Actions
    handleSearch,
    handleFiltersChange,
    resetFilters,
    saveCurrentFilters,
    loadSavedFilter,
    setSearchQuery
  };
}
