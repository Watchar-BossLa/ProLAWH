
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lightbulb } from "lucide-react";

interface CareerStatsCardsProps {
  stats: {
    total: number;
    implemented: number;
    accepted: number;
    implementationRate: number;
    acceptanceRate: number;
  };
  lastGenerated?: string;
}

export function CareerStatsCards({ stats, lastGenerated }: CareerStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
          <CardDescription>All generated recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {lastGenerated 
              ? `Last generated on ${new Date(lastGenerated).toLocaleDateString()}` 
              : 'No insights generated yet'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
          <CardDescription>Recommendations you've implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.implementationRate}%</div>
            <CheckCircle2 className={`h-5 w-5 ${stats.implementationRate > 50 ? 'text-green-500' : 'text-amber-500'}`} />
          </div>
          <Progress value={stats.implementationRate} className="h-2 mt-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            {stats.implemented} of {stats.total} recommendations implemented
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          <CardDescription>Recommendations you've accepted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
            <Lightbulb className={`h-5 w-5 ${stats.acceptanceRate > 50 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <Progress value={stats.acceptanceRate} className="h-2 mt-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            {stats.accepted + stats.implemented} of {stats.total} recommendations accepted
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
