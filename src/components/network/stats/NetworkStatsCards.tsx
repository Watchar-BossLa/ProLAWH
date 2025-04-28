
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkStats } from "@/types/network";
import { Users, UserRound, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkStatsCardsProps {
  stats: NetworkStats;
}

export function NetworkStatsCards({ stats }: NetworkStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="hover-card glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Network</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalConnections}</div>
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
          <div className="text-2xl font-bold">{stats.mentors}</div>
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
          <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          <div className="flex mt-1">
            <Button variant="link" className="h-auto p-0 text-xs">View all requests</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
