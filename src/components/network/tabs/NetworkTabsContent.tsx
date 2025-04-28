
import { TabsContent } from "@/components/ui/tabs";
import { NetworkGrid } from "@/components/network/NetworkGrid";
import { NetworkAnalyticsCards } from "@/components/network/analytics/NetworkAnalyticsCards";
import { NetworkGraph } from "@/components/network/visualization/NetworkGraph";
import { SkillMatchMatrix } from "@/components/network/skills/SkillMatchMatrix";
import { NetworkRecommendations } from "@/components/network/recommendations/NetworkRecommendations";
import { NetworkConnection } from "@/types/network";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NetworkTabsContentProps {
  activeTab: string;
  filterType: string;
  onChatOpen: (connectionId: string) => void;
  connections: NetworkConnection[];
  selectedConnectionId: string | null;
  onConnectionSelect: (connectionId: string) => void;
  recommendations: any[];
  isLoadingRecommendations: boolean;
  onRefreshRecommendations: () => void;
  insights: string;
  userSkills: string[];
}

export function NetworkTabsContent({
  activeTab,
  filterType,
  onChatOpen,
  connections,
  selectedConnectionId,
  onConnectionSelect,
  recommendations,
  isLoadingRecommendations,
  onRefreshRecommendations,
  insights,
  userSkills
}: NetworkTabsContentProps) {
  return (
    <>
      <TabsContent value="connections" className="m-0">
        <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
          <NetworkGrid 
            filterType={filterType} 
            onChatOpen={onChatOpen} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="visualization" className="m-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border rounded-lg shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Interactive Network Map</h3>
              <div className="h-[500px]">
                <NetworkGraph 
                  connections={connections} 
                  highlightedConnectionId={selectedConnectionId}
                  onConnectionSelect={onConnectionSelect}
                />
              </div>
            </div>
          </div>
          <div>
            <SkillMatchMatrix 
              connections={connections} 
              userSkills={userSkills}
              onSelectConnection={onConnectionSelect}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="recommendations" className="m-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <NetworkRecommendations 
              recommendations={recommendations}
              isLoading={isLoadingRecommendations}
              onRefresh={onRefreshRecommendations}
              onSelectConnection={onConnectionSelect}
              connections={connections}
              insights={insights}
            />
          </div>
          <div>
            <Card className="hover-card glass-card">
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    These skills are used to generate personalized recommendations
                    and find the most compatible connections in your network.
                  </p>
                </div>
                <Button className="w-full mt-4">
                  Update Your Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="m-0">
        <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Network Growth & Engagement</h3>
          <p className="text-muted-foreground mb-4">
            Analyze your network's growth, engagement levels, and skill distribution over time.
          </p>
          <NetworkAnalyticsCards />
        </div>
      </TabsContent>
    </>
  );
}
