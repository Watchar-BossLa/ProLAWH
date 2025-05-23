
import { useMemo, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SkillGapRadarChart() {
  const skillGapData = useSkillGapData();
  const [mode, setMode] = useState<'all' | 'gaps' | 'strengths'>('all');
  
  const filteredData = useMemo(() => {
    if (mode === 'all') return skillGapData;
    if (mode === 'gaps') return skillGapData.filter(item => item.marketDemand > item.userLevel);
    return skillGapData.filter(item => item.userLevel >= item.marketDemand);
  }, [skillGapData, mode]);

  const chartConfig = useMemo(() => ({
    userLevel: { label: "Your Skills", color: "#10b981" },
    marketDemand: { label: "Market Demand", color: "#3b82f6" },
  }), []);
  
  const gapSize = useMemo(() => {
    if (!skillGapData.length) return 0;
    let totalGap = 0;
    skillGapData.forEach(skill => {
      if (skill.marketDemand > skill.userLevel) {
        totalGap += (skill.marketDemand - skill.userLevel);
      }
    });
    return (totalGap / skillGapData.length).toFixed(1);
  }, [skillGapData]);
  
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Average gap: {gapSize} points</CardDescription>
          </div>
          <Select value={mode} onValueChange={(value) => setMode(value as 'all' | 'gaps' | 'strengths')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="gaps">Show Gaps</SelectItem>
              <SelectItem value="strengths">Show Strengths</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData}>
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
        
        {mode === 'gaps' && filteredData.length > 0 && (
          <div className="mt-4 pt-2 border-t text-sm">
            <p className="font-medium mb-1">Top skill gaps to address:</p>
            <ul className="list-disc pl-5 space-y-1">
              {filteredData
                .sort((a, b) => (b.marketDemand - b.userLevel) - (a.marketDemand - a.userLevel))
                .slice(0, 3)
                .map((skill) => (
                  <li key={skill.subject}>
                    {skill.subject}: <span className="text-red-500">{skill.marketDemand - skill.userLevel} points gap</span>
                  </li>
                ))
              }
            </ul>
          </div>
        )}
        
        {mode === 'strengths' && filteredData.length > 0 && (
          <div className="mt-4 pt-2 border-t text-sm">
            <p className="font-medium mb-1">Your top strengths:</p>
            <ul className="list-disc pl-5 space-y-1">
              {filteredData
                .sort((a, b) => (b.userLevel) - (a.userLevel))
                .slice(0, 3)
                .map((skill) => (
                  <li key={skill.subject}>
                    {skill.subject}: <span className="text-green-500">Level {skill.userLevel}/10</span>
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
