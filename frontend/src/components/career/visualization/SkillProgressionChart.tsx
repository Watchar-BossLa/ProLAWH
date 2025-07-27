
import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Line
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useSkillProgressionData } from "./hooks/useSkillProgressionData";
import { useMarketCrossover } from "./hooks/useMarketCrossover";
import { SkillProgressionControls } from "./components/SkillProgressionControls";
import { MarketGapAnalysis } from "./components/MarketGapAnalysis";
import { chartConfig, PRESET_SKILLS } from "./utils/chartConfig";
import type { ViewType } from "./types/skillProgressionTypes";

export function SkillProgressionChart() {
  const [viewType, setViewType] = useState<ViewType>('overview');
  const [selectedSkill, setSelectedSkill] = useState<string>(PRESET_SKILLS[0]);
  
  const progressData = useSkillProgressionData();
  const currentData = viewType === 'overview' 
    ? progressData.overview 
    : progressData.skills[selectedSkill];
  
  const marketCrossoverPoint = useMarketCrossover(viewType, currentData);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Skill Progression</CardTitle>
            <CardDescription>
              {viewType === 'overview' 
                ? 'Your overall skill growth trajectory' 
                : `Projecting growth for ${selectedSkill}`}
            </CardDescription>
          </div>
          
          <SkillProgressionControls
            viewType={viewType}
            setViewType={setViewType}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis 
                  label={{ value: 'Skill Level', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 10]} 
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCurrent)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorProjected)" 
                />
                {viewType === 'overview' ? (
                  <Line
                    type="monotone"
                    dataKey="marketAverage"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="marketLevel"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <MarketGapAnalysis 
          viewType={viewType}
          marketCrossoverPoint={marketCrossoverPoint}
        />
      </CardContent>
    </Card>
  );
}
