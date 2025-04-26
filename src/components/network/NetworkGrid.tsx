
import { NetworkConnection } from "@/types/network";
import { NetworkCard } from "./NetworkCard";

interface NetworkGridProps {
  filterType: string;
}

export function NetworkGrid({ filterType }: NetworkGridProps) {
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
      status: "connected"
    },
    // ... more mock connections
  ];

  const filteredConnections = filterType === "all" 
    ? connections 
    : connections.filter(c => c.connectionType === filterType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredConnections.map(connection => (
        <NetworkCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}
