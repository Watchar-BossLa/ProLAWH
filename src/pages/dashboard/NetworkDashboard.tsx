
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NetworkStats, NetworkConnection } from "@/types/network";
import { NetworkGrid } from "@/components/network/NetworkGrid";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { ChatInterface } from "@/components/network/ChatInterface";
import { Users, UserRound, Network, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data - Replace with actual data from your backend
const mockStats: NetworkStats = {
  totalConnections: 142,
  mentors: 12,
  peers: 89,
  colleagues: 41,
  pendingRequests: 5
};

export default function NetworkDashboard() {
  const [filterType, setFilterType] = useState<string>("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
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

  const handleChatOpen = (connectionId: string) => {
    setActiveChatId(connectionId);
  };

  const handleChatClose = () => {
    setActiveChatId(null);
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
      
      <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 shadow-sm">
        <NetworkFilters activeFilter={filterType} onFilterChange={setFilterType} />
        <div className="mt-4">
          <NetworkGrid filterType={filterType} onChatOpen={handleChatOpen} />
        </div>
      </div>
      
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
