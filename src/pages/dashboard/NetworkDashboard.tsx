
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkStats, NetworkConnection } from "@/types/network";
import { NetworkGrid } from "@/components/network/NetworkGrid";
import { NetworkMetrics } from "@/components/network/NetworkMetrics";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { Users, UserRound, Network } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Professional Network</h2>
          <p className="text-muted-foreground">
            Connect, collaborate, and grow with other professionals
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalConnections}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentorship Connections</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.mentors}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      <NetworkMetrics stats={mockStats} />
      <NetworkFilters activeFilter={filterType} onFilterChange={setFilterType} />
      <NetworkGrid filterType={filterType} />
    </div>
  );
}
