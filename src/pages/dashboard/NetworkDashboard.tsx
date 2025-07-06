
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkStatsCards } from "@/components/network/stats/NetworkStatsCards";
import { NetworkHeader } from "@/components/network/header/NetworkHeader";
import { NetworkTabsContent } from "@/components/network/tabs/NetworkTabsContent";
import { NetworkFiltersPanel } from "@/components/network/filters/NetworkFiltersPanel";
import { NetworkStatusManager } from "@/components/network/presence/NetworkStatusManager";
import { NetworkChatDialog } from "@/components/network/chat/NetworkChatDialog";
import { EnhancedNetworkGraph } from "@/components/network/visualization/EnhancedNetworkGraph";
import { SmartConnectionSuggestions } from "@/components/network/ai/SmartConnectionSuggestions";
import { ProjectMatchingEngine } from "@/components/collaboration/ProjectMatchingEngine";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { useNetworkState } from "@/hooks/network/useNetworkState";
import { useNetworkData } from "@/hooks/network/useNetworkData";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { Users, Network, Brain, BarChart, Zap, Rocket } from "lucide-react";
import { toast } from "sonner";
import { mockConnections, mockStats, mockUserSkills, mockIndustries, mockActiveChatConnection } from "@/data/mockNetworkData";

export default function NetworkDashboard() {
  const { state, actions } = useNetworkState();
  const { isEnabled } = useFeatureFlags();
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

  // Mock data for Phase 3 features
  const [availableConnections] = useState([
    { id: 'avail-1', name: 'Sarah Chen', role: 'AI Researcher', company: 'TechCorp', skills: ['Machine Learning', 'Python'], industry: 'Technology' },
    { id: 'avail-2', name: 'Mike Johnson', role: 'Product Manager', company: 'InnovateLabs', skills: ['Product Strategy', 'Analytics'], industry: 'Technology' },
    { id: 'avail-3', name: 'Lisa Wang', role: 'UX Designer', company: 'DesignStudio', skills: ['UI/UX', 'Figma'], industry: 'Design' }
  ]);

  const [availableProjects] = useState([
    { id: 'proj-1', title: 'Green Energy Platform', description: 'Building sustainable energy solutions', skillsNeeded: ['React', 'Node.js', 'Sustainability'], teamSize: 4, duration: '6 months' },
    { id: 'proj-2', title: 'AI Learning Assistant', description: 'Educational AI platform', skillsNeeded: ['Machine Learning', 'Python', 'Education'], teamSize: 3, duration: '4 months' },
    { id: 'proj-3', title: 'Remote Work Tools', description: 'Collaboration platform for remote teams', skillsNeeded: ['React', 'WebRTC', 'UI/UX'], teamSize: 5, duration: '8 months' }
  ]);

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

  const handleConnect = (connectionId: string) => {
    toast.success("Connection request sent!");
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
            {isEnabled('advancedNetworking') && (
              <TabsTrigger value="enhanced-viz">
                <Network className="h-4 w-4 mr-2" />
                Enhanced Viz
              </TabsTrigger>
            )}
            {isEnabled('aiConnectionSuggestions') && (
              <TabsTrigger value="smart-suggestions">
                <Zap className="h-4 w-4 mr-2" />
                Smart Suggestions
              </TabsTrigger>
            )}
            {isEnabled('collaborativeProjects') && (
              <TabsTrigger value="projects">
                <Rocket className="h-4 w-4 mr-2" />
                Project Matching
              </TabsTrigger>
            )}
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

          {/* Phase 3 Enhanced Features */}
          {isEnabled('advancedNetworking') && activeTab === 'enhanced-viz' && (
            <div className="mt-6">
              <EnhancedNetworkGraph
                connections={filteredConnections}
                onConnectionSelect={actions.selectConnection}
                highlightedConnectionId={state.selectedConnectionId}
              />
            </div>
          )}

          {isEnabled('aiConnectionSuggestions') && activeTab === 'smart-suggestions' && (
            <div className="mt-6">
              <SmartConnectionSuggestions
                userProfile={{ skills: mockUserSkills, interests: ['Technology', 'AI', 'Sustainability'] }}
                existingConnections={state.connections}
                availableConnections={availableConnections}
                onConnect={handleConnect}
              />
            </div>
          )}

          {isEnabled('collaborativeProjects') && activeTab === 'projects' && (
            <div className="mt-6">
              <ProjectMatchingEngine
                userSkills={mockUserSkills}
                userInterests={['Technology', 'AI', 'Sustainability']}
                availableProjects={availableProjects}
                networkConnections={state.connections}
              />
            </div>
          )}
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
