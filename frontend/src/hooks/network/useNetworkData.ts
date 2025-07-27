
import { useMemo } from 'react';
import { NetworkConnection } from '@/types/network';

export function useNetworkData(
  connections: NetworkConnection[],
  filterType: string,
  searchQuery: string,
  selectedIndustry: string | null
) {
  const filteredConnections = useMemo(() => {
    return connections.filter(conn => {
      // Filter by connection type
      const typeMatch = filterType === "all" ? true : conn.connectionType === filterType;
      
      // Filter by industry if one is selected
      const industryMatch = !selectedIndustry ? true : conn.industry === selectedIndustry;
      
      // Filter by search query
      const searchMatch = !searchQuery ? true : 
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        conn.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conn.skills && conn.skills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      return typeMatch && industryMatch && searchMatch;
    });
  }, [connections, filterType, searchQuery, selectedIndustry]);

  const connectionStats = useMemo(() => {
    const totalConnections = connections.length;
    const mentors = connections.filter(c => c.connectionType === 'mentor').length;
    const peers = connections.filter(c => c.connectionType === 'peer').length;
    const colleagues = connections.filter(c => c.connectionType === 'colleague').length;
    
    return { totalConnections, mentors, peers, colleagues };
  }, [connections]);

  return {
    filteredConnections,
    connectionStats
  };
}
