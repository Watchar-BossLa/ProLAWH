
import { useState, useMemo } from "react";
import { NetworkConnection } from "@/types/network";

export function useNetworkFiltering(connections: NetworkConnection[]) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
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

  return {
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
    filteredConnections
  };
}
