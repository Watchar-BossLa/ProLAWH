
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkStats, NetworkConnection } from "@/types/network";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkStatsCards } from "@/components/network/stats/NetworkStatsCards";
import { NetworkHeader } from "@/components/network/header/NetworkHeader";
import { NetworkTabsContent } from "@/components/network/tabs/NetworkTabsContent";
import { ChatInterface } from "@/components/network/ChatInterface";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { Users, Network, Brain, BarChart, Filter, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { NetworkIndustrySelector } from "@/components/network/NetworkIndustrySelector";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

// Mock industries/sectors for filtering
const mockIndustries = [
  "Technology", "Finance", "Healthcare", "Education", 
  "Environment", "Marketing", "Design", "Data Science"
];

export default function NetworkDashboard() {
  const [filterType, setFilterType] = useState<string>("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connections");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
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
    onlineStatus: "online",
    industry: "Technology"
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
          unreadMessages: 2,
          industry: "Technology",
          careerPath: "Software Engineering",
          expertise: ["Frontend Development", "Technical Leadership"]
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
          onlineStatus: "away",
          careerPath: "Product Management"
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
          onlineStatus: "offline",
          careerPath: "Data Science"
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
          unreadMessages: 5,
          careerPath: "Design"
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
          bio: "Building scalable systems for enterprise applications",
          careerPath: "Software Engineering",
          expertise: ["Backend Development", "Cloud Architecture"]
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
          onlineStatus: "online",
          careerPath: "Marketing"
        }
      ];
      
      setConnections(mockConnections);
    };
    
    fetchConnections();
  }, []);

  // Filter connections based on type and industry
  const filteredConnections = connections.filter(conn => {
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
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <NetworkFilters 
          activeFilter={filterType}
          onFilterChange={setFilterType}
        />
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Tag size={16} />
                <span>Industry/Sector</span>
                {selectedIndustry && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedIndustry}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Industry</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedIndustry(null)}>
                All Industries
              </DropdownMenuItem>
              {mockIndustries.map((industry) => (
                <DropdownMenuItem
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                >
                  {industry}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
