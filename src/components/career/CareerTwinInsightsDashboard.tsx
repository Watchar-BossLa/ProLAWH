
import { BarChart2 } from "lucide-react";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { useCareerStats } from "@/hooks/career/useCareerStats";
import { useCareerChartData } from "@/hooks/career/useCareerChartData";
import { CareerStatsCards } from "@/components/career/insights/CareerStatsCards";
import { StatusDistributionChart } from "@/components/career/insights/StatusDistributionChart";
import { TypeDistributionChart } from "@/components/career/insights/TypeDistributionChart";
import { RecentActivityFeed } from "@/components/career/insights/RecentActivityFeed";

interface CareerTwinInsightsDashboardProps {
  recommendations: CareerRecommendation[];
}

export function CareerTwinInsightsDashboard({ recommendations }: CareerTwinInsightsDashboardProps) {
  const stats = useCareerStats(recommendations);
  const { typeData, statusData } = useCareerChartData(recommendations);

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
        <p className="text-muted-foreground">
          Generate career insights first to view analytics and progress metrics.
        </p>
      </div>
    );
  }

  const lastGenerated = recommendations.length > 0 ? recommendations[0].created_at : undefined;
  
  return (
    <div className="space-y-6">
      <CareerStatsCards stats={stats} lastGenerated={lastGenerated} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <StatusDistributionChart data={statusData} />
        <TypeDistributionChart data={typeData} />
      </div>
      
      <RecentActivityFeed recommendations={recommendations} />
    </div>
  );
}
