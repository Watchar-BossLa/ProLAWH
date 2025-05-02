
import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkillGapData } from '@/hooks/useSkillGapData';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

export const CareerSkillsRadarChart = () => {
  const skillGapData = useSkillGapData();
  
  // Ensure data formatting is correct
  const chartData = skillGapData.map(item => ({
    subject: item.subject,
    userLevel: item.userLevel,
    marketDemand: item.marketDemand,
  }));
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Skills vs Market Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            config={{
              userLevel: { color: "#10b981" }, // green
              marketDemand: { color: "#3b82f6" }, // blue
            }}
          >
            <RadarChart outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                name="Your Skills"
                dataKey="userLevel"
                stroke="var(--color-userLevel)"
                fill="var(--color-userLevel)"
                fillOpacity={0.3}
              />
              <Radar
                name="Market Demand"
                dataKey="marketDemand"
                stroke="var(--color-marketDemand)"
                fill="var(--color-marketDemand)"
                fillOpacity={0.3}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </RadarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
