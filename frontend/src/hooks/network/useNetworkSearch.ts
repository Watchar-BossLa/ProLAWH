
import { useState, useMemo } from 'react';
import { NetworkConnection } from '@/types/network';

export function useNetworkSearch(connections: NetworkConnection[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return connections;
    }

    const query = searchQuery.toLowerCase();
    return connections.filter(connection => 
      connection.name.toLowerCase().includes(query) ||
      connection.role.toLowerCase().includes(query) ||
      connection.company.toLowerCase().includes(query) ||
      (connection.skills && connection.skills.some(skill => 
        skill.toLowerCase().includes(query)
      )) ||
      (connection.industry && connection.industry.toLowerCase().includes(query))
    );
  }, [connections, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    clearSearch
  };
}
