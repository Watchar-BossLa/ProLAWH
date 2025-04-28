
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkStats, NetworkConnection } from "@/types/network";
import { NetworkGrid } from "@/components/network/NetworkGrid";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { ChatInterface } from "@/components/network/ChatInterface";
import { NetworkGraph } from "@/components/network/visualization/NetworkGraph";
import { NetworkRecommendations } from "@/components/network/recommendations/NetworkRecommendations";
import { SkillMatchMatrix } from "@/components/network/skills/SkillMatchMatrix";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { Users, UserRound, Network, Search, Bell, BarChart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock data - Replace with actual data from your backend
const mockStats: NetworkStats = {
  totalConnections: 142,
  mentors: 12,
  peers: 89,
  colleagues: 41,
  pendingRequests: 5
};

// Mock user skills
const mockUserSkills = [
  "React", "TypeScript", "UI/UX Design", "Product Management", 
  "Data Analysis", "Node.js", "Technical Leadership"
];

export default function NetworkDashboard() {
  const [filterType, setFilterType] = useState<string>("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connections");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  
  const { 
    getRecommendations, 
    recommendations, 
    insights, 
    isLoading: isLoadingRecommendations 
  } = useNetworkRecommendations();
  
  // Mock connection data for the active chat
  const activeChatConnection: NetworkConnection | undefined = {
    id: "1",
    userId: "user1",
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    connectionType: "mentor",
    connectionStrength: 85,
    lastInteraction: "2025-04-20",
    status: "connected",
    skills: ["React", "TypeScript", "UI/UX"],
    bio: "Tech lead with 10+ years in frontend development",
    location: "San Francisco, CA",
    onlineStatus: "online"
  };

  // Fetch connections (mock function)
  useEffect(() => {
    const fetchConnections = async () => {
      // In real application, this would be an API call
      // For now, using mock data
      const mockConnections: NetworkConnection[] = [
        {
          id: "1",
          userId: "user1",
          name: "Sarah Chen",
          role: "Senior Developer",
          company: "TechCorp",
          connectionType: "mentor",
          connectionStrength: 85,
          lastInteraction: "2025-04-20",
          status: "connected",
          skills: ["React", "TypeScript", "UI/UX", "System Architecture", "Leadership"],
          bio: "Tech lead with 10+ years in frontend development",
          location: "San Francisco, CA",
          onlineStatus: "online",
          unreadMessages: 2
        },
        {
          id: "2",
          userId: "user2",
          name: "Marcus Johnson",
          role: "Product Manager",
          company: "InnovateLab",
          connectionType: "peer",
          connectionStrength: 72,
          lastInteraction: "2025-04-18",
          status: "connected",
          skills: ["Product Strategy", "Market Analysis", "Agile", "Data Analysis"],
          location: "New York, NY",
          industry: "Technology",
          onlineStatus: "away"
        },
        {
          id: "3",
          userId: "user3",
          name: "Priya Sharma",
          role: "Data Scientist",
          company: "DataWorks",
          connectionType: "colleague",
          connectionStrength: 63,
          lastInteraction: "2025-04-15",
          status: "connected",
          skills: ["Machine Learning", "Python", "Data Visualization", "Statistics"],
          bio: "Turning data into actionable insights",
          industry: "Data Analytics",
          onlineStatus: "offline"
        },
        {
          id: "4",
          userId: "user4",
          name: "David Wilson",
          role: "UX Designer",
          company: "Creative Solutions",
          connectionType: "peer",
          connectionStrength: 91,
          lastInteraction: "2025-04-21",
          status: "connected",
          skills: ["Figma", "User Research", "UI Design", "Prototyping", "Adobe XD"],
          location: "Austin, TX",
          industry: "Design",
          onlineStatus: "online",
          unreadMessages: 5
        },
        {
          id: "5",
          userId: "user5",
          name: "Elena Rodriguez",
          role: "Backend Engineer",
          company: "ServerStack",
          connectionType: "mentor",
          connectionStrength: 79,
          lastInteraction: "2025-04-17",
          status: "connected",
          skills: ["Node.js", "Database Design", "API Development", "AWS", "Microservices"],
          industry: "Cloud Computing",
          bio: "Building scalable systems for enterprise applications"
        },
        {
          id: "6",
          userId: "user6",
          name: "James Taylor",
          role: "Marketing Specialist",
          company: "GrowthHackers",
          connectionType: "colleague",
          connectionStrength: 68,
          lastInteraction: "2025-04-16",
          status: "connected",
          skills: ["Content Strategy", "SEO", "Social Media", "Analytics", "Copywriting"],
          location: "Chicago, IL",
          industry: "Marketing",
          onlineStatus: "online"
        }
      ];
      
      setConnections(mockConnections);
    };
    
    fetchConnections();
  }, []);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Professional Network</h2>
          <p className="text-muted-foreground">
            Connect, collaborate, and grow with other professionals
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isSearchExpanded ? (
            <div className="flex gap-2 items-center animate-fade-in">
              <Input
                placeholder="Search network..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                autoFocus
              />
              <Button variant="ghost" onClick={() => setIsSearchExpanded(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="default">
                <UserRound className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalConnections}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +23 new connections this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentorship Connections</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.mentors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 active mentorship sessions
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingRequests}</div>
            <div className="flex mt-1">
              <Button variant="link" className="h-auto p-0 text-xs">View all requests</Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
        
        <TabsContent value="connections" className="m-0">
          <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
            <NetworkFilters activeFilter={filterType} onFilterChange={setFilterType} />
            <div className="mt-4">
              <NetworkGrid 
                filterType={filterType} 
                onChatOpen={handleChatOpen} 
              />
            </div>
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
                    onConnectionSelect={handleConnectionSelect}
                  />
                </div>
              </div>
            </div>
            <div>
              <SkillMatchMatrix 
                connections={connections} 
                userSkills={mockUserSkills}
                onSelectConnection={handleConnectionSelect}
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
                onRefresh={handleRefreshRecommendations}
                onSelectConnection={handleConnectionSelect}
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
                    {mockUserSkills.map(skill => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Network Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Growth chart visualization</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Skill distribution chart</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Connection Strength</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Connection strength metrics</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Industry Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Industry breakdown chart</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={activeChatId !== null} onOpenChange={(open) => !open && handleChatClose()}>
        <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] overflow-hidden">
          {activeChatConnection && (
            <ChatInterface
              connection={activeChatConnection}
              onClose={handleChatClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
