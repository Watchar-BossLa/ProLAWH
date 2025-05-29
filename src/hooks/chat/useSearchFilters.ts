
import { useState, useCallback } from 'react';
import { SearchFilters } from './types';

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
}
