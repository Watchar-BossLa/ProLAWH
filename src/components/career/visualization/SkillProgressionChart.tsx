
import { useMemo } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function SkillProgressionChart() {
  // This would come from API in a real application
  const progressData = useMemo(() => [
    { month: 'Jan', current: 2, projected: 2 },
    { month: 'Feb', current: 3, projected: 3 },
    { month: 'Mar', current: 3.5, projected: 4 },
    { month: 'Apr', current: 4, projected: 5 },
    { month: 'May', current: null, projected: 6 },
    { month: 'Jun', current: null, projected: 7 },
    { month: 'Jul', current: null, projected: 7.5 },
    { month: 'Aug', current: null, projected: 8 },
  ], []);

  const chartConfig = {
    current: { label: "Current Progress", color: "#10b981" },
    projected: { label: "Projected Growth", color: "#6366f1" },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill Progression</CardTitle>
        <CardDescription>
          Your current and projected skill growth over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
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
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
