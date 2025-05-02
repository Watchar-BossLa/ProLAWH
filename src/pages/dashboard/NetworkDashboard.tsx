
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkStatsCards } from "@/components/network/stats/NetworkStatsCards";
import { NetworkHeader } from "@/components/network/header/NetworkHeader";
import { NetworkTabsContent } from "@/components/network/tabs/NetworkTabsContent";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { Users, Network, Brain, BarChart } from "lucide-react";
import { toast } from "sonner";
import { NetworkToolbar } from "@/components/network/toolbar/NetworkToolbar";
import { NetworkChatDialog } from "@/components/network/chat/NetworkChatDialog";
import { useNetworkFiltering } from "@/hooks/useNetworkFiltering";
import { mockConnections, mockStats, mockUserSkills, mockIndustries, mockActiveChatConnection } from "@/data/mockNetworkData";

export default function NetworkDashboard() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connections");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connections, setConnections] = useState(mockConnections);
  
  const { 
    filterType, 
    setFilterType,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
    filteredConnections
  } = useNetworkFiltering(connections);
  
  const { 
    getRecommendations, 
    recommendations, 
    insights, 
    isLoading: isLoadingRecommendations 
  } = useNetworkRecommendations();

  const handleChatOpen = (connectionId: string) => {
    setActiveChatId(connectionId);
  };

  const handleChatClose = () => {
    setActiveChatId(null);
  };
  
  const handleConnectionSelect = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
  };
  
  const handleRefreshRecommendations = async () => {
    try {
      const result = await getRecommendations(mockUserSkills, connections);
      if (result) {
        toast.success("AI recommendations updated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate recommendations");
    }
  };

  return (
    <div className="space-y-6">
      <NetworkHeader 
        isSearchExpanded={isSearchExpanded}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchToggle={() => setIsSearchExpanded(!isSearchExpanded)}
      />
      
      <NetworkStatsCards stats={mockStats} />
      
      <NetworkToolbar
        activeFilter={filterType}
        onFilterChange={setFilterType}
        industries={mockIndustries}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />
      
      <NetworkMetrics stats={mockStats} />
      
      <Tabs defaultValue="connections" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="connections">
            <Users className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <Network className="h-4 w-4 mr-2" />
            Network Visualization
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Brain className="h-4 w-4 mr-2" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Network Analytics
          </TabsTrigger>
        </TabsList>
        
        <NetworkTabsContent 
          activeTab={activeTab}
          filterType={filterType}
          onChatOpen={handleChatOpen}
          connections={filteredConnections}
          selectedConnectionId={selectedConnectionId}
          onConnectionSelect={handleConnectionSelect}
          recommendations={recommendations}
          isLoadingRecommendations={isLoadingRecommendations}
          onRefreshRecommendations={handleRefreshRecommendations}
          insights={insights}
          userSkills={mockUserSkills}
        />
      </Tabs>
      
      <NetworkChatDialog
        activeChatId={activeChatId}
        activeChatConnection={mockActiveChatConnection}
        onClose={handleChatClose}
      />
    </div>
  );
}
