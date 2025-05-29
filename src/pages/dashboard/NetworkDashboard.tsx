
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkStatsCards } from "@/components/network/stats/NetworkStatsCards";
import { NetworkHeader } from "@/components/network/header/NetworkHeader";
import { NetworkTabsContent } from "@/components/network/tabs/NetworkTabsContent";
import { NetworkFiltersPanel } from "@/components/network/filters/NetworkFiltersPanel";
import { NetworkStatusManager } from "@/components/network/presence/NetworkStatusManager";
import { NetworkChatDialog } from "@/components/network/chat/NetworkChatDialog";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { useNetworkState } from "@/hooks/network/useNetworkState";
import { useNetworkData } from "@/hooks/network/useNetworkData";
import { Users, Network, Brain, BarChart } from "lucide-react";
import { toast } from "sonner";
import { mockConnections, mockStats, mockUserSkills, mockIndustries, mockActiveChatConnection } from "@/data/mockNetworkData";

export default function NetworkDashboard() {
  const { state, actions } = useNetworkState();
  const [activeTab, setActiveTab] = useState<string>("connections");
  
  const { 
    getRecommendations, 
    recommendations, 
    insights, 
    isLoading: isLoadingRecommendations 
  } = useNetworkRecommendations();

  const { filteredConnections, connectionStats } = useNetworkData(
    state.connections,
    state.filterType,
    state.searchQuery,
    state.selectedIndustry
  );

  // Initialize with mock data
  useEffect(() => {
    actions.setConnections(mockConnections);
  }, [actions]);

  const handleRefreshRecommendations = async () => {
    try {
      const result = await getRecommendations(mockUserSkills, state.connections);
      if (result) {
        toast.success("AI recommendations updated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate recommendations");
    }
  };

  const getActiveChatConnection = () => {
    if (!state.activeChatId) return undefined;
    return state.connections.find(conn => conn.id === state.activeChatId) || mockActiveChatConnection;
  };

  return (
    <NetworkStatusManager>
      <div className="space-y-6">
        <NetworkHeader 
          isSearchExpanded={state.isSearchExpanded}
          searchQuery={state.searchQuery}
          onSearchChange={actions.setSearchQuery}
          onSearchToggle={actions.toggleSearch}
        />
        
        <NetworkStatsCards stats={mockStats} />
        
        <NetworkFiltersPanel
          activeFilter={state.filterType}
          onFilterChange={actions.setFilterType}
          industries={mockIndustries}
          selectedIndustry={state.selectedIndustry}
          onSelectIndustry={actions.setSelectedIndustry}
          connectionStats={connectionStats}
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
            filterType={state.filterType}
            onChatOpen={actions.openChat}
            connections={filteredConnections}
            selectedConnectionId={state.selectedConnectionId}
            onConnectionSelect={actions.selectConnection}
            recommendations={recommendations}
            isLoadingRecommendations={isLoadingRecommendations}
            onRefreshRecommendations={handleRefreshRecommendations}
            insights={insights}
            userSkills={mockUserSkills}
          />
        </Tabs>
        
        <NetworkChatDialog
          activeChatId={state.activeChatId}
          activeChatConnection={getActiveChatConnection()}
          onClose={actions.closeChat}
        />
      </div>
    </NetworkStatusManager>
  );
}
