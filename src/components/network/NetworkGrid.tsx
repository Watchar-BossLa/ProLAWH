
import { useState, useMemo } from "react";
import { NetworkConnection } from "@/types/network";
import { NetworkCard } from "./NetworkCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NetworkGridProps {
  filterType: string;
  onChatOpen: (connectionId: string) => void;
}

export function NetworkGrid({ filterType, onChatOpen }: NetworkGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - Replace with actual data fetching
  const connections: NetworkConnection[] = [
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
      skills: ["React", "TypeScript", "UI/UX"],
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
      skills: ["Product Strategy", "Market Analysis", "Agile"],
      location: "New York, NY",
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
      skills: ["Machine Learning", "Python", "Data Visualization"],
      bio: "Turning data into actionable insights",
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
      skills: ["Figma", "User Research", "UI Design"],
      location: "Austin, TX",
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
      skills: ["Node.js", "Database Design", "API Development"],
      bio: "Building scalable systems for enterprise applications"
    },
    {
      id: "6",
      userId: "user6",
      name: "James Taylor",
      avatar: "https://i.pravatar.cc/150?img=68",
      role: "Marketing Specialist",
      company: "GrowthHackers",
      connectionType: "colleague",
      connectionStrength: 68,
      lastInteraction: "2025-04-16",
      status: "connected",
      skills: ["Content Strategy", "SEO", "Social Media"],
      location: "Chicago, IL",
      onlineStatus: "online"
    }
  ];

  const filteredConnections = useMemo(() => {
    let filtered = connections;
    
    // Filter by connection type
    if (filterType !== "all") {
      filtered = filtered.filter(c => c.connectionType === filterType);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c => 
          c.name.toLowerCase().includes(query) || 
          c.role.toLowerCase().includes(query) || 
          c.company.toLowerCase().includes(query) ||
          c.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [connections, filterType, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search by name, role, company or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {filteredConnections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No connections found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map(connection => (
            <NetworkCard 
              key={connection.id} 
              connection={connection} 
              onChatOpen={onChatOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
