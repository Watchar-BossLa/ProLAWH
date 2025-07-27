
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface NetworkAnalyticsCardsProps {
  className?: string;
}

export function NetworkAnalyticsCards({ className }: NetworkAnalyticsCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className || ""}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Network Growth</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <p className="text-muted-foreground">Growth chart visualization</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Skill Distribution</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <p className="text-muted-foreground">Skill distribution chart</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Connection Strength</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <p className="text-muted-foreground">Connection strength metrics</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Industry Breakdown</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <p className="text-muted-foreground">Industry breakdown chart</p>
        </CardContent>
      </Card>
    </div>
  );
}
