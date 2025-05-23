
import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from "recharts";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";

export function SkillGapRadarChart() {
  const skillGapData = useSkillGapData();

  const chartConfig = useMemo(() => ({
    userLevel: { label: "Your Skills", color: "#10b981" },
    marketDemand: { label: "Market Demand", color: "#3b82f6" },
  }), []);
  
  if (skillGapData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <p className="text-muted-foreground">No skill data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillGapData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Radar
                name="Your Skills"
                dataKey="userLevel"
                stroke={chartConfig.userLevel.color}
                fill={chartConfig.userLevel.color}
                fillOpacity={0.3}
              />
              <Radar
                name="Market Demand"
                dataKey="marketDemand"
                stroke={chartConfig.marketDemand.color}
                fill={chartConfig.marketDemand.color}
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
