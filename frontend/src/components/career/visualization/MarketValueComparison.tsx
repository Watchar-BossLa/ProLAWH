
import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useSkillGapData } from "@/hooks/useSkillGapData";

export function MarketValueComparison() {
  const skillGapData = useSkillGapData();
  
  const marketValueData = useMemo(() => {
    if (!skillGapData.length) return [];
    
    // Transform skill data to focus on market value metrics
    return skillGapData
      .sort((a, b) => b.marketDemand - a.marketDemand)
      .slice(0, 6)
      .map(skill => ({
        name: skill.subject,
        marketDemand: skill.marketDemand,
        userLevel: skill.userLevel,
        marketValue: Math.round((skill.marketDemand * 15000) / 2), // Mock salary impact
        growthRate: Math.round((skill.marketDemand / 10) * 15 + 5), // Mock growth rate
      }));
  }, [skillGapData]);
  
  const chartConfig = useMemo(() => ({
    marketValue: { label: "Market Value ($)", color: "#10b981" },
    growthRate: { label: "Annual Growth (%)", color: "#6366f1" },
  }), []);

  if (skillGapData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Market Value Analysis</CardTitle>
          <CardDescription>Comparing your skill value to market demand</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <p className="text-muted-foreground">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Value Analysis</CardTitle>
        <CardDescription>
          Financial impact and growth trajectory of your top skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketValueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="marketValue" 
                  name="Market Value ($)" 
                  fill="#10b981" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="growthRate" 
                  name="Annual Growth (%)" 
                  fill="#6366f1" 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Key Insights:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Your top skills command an average premium of ${Math.round(marketValueData.reduce((acc, skill) => acc + skill.marketValue, 0) / marketValueData.length).toLocaleString()} in the market</li>
            <li>• {marketValueData[0]?.name} has the highest current market value at ${marketValueData[0]?.marketValue.toLocaleString()}</li>
            <li>• {marketValueData.sort((a, b) => b.growthRate - a.growthRate)[0]?.name} shows the fastest growth at {marketValueData.sort((a, b) => b.growthRate - a.growthRate)[0]?.growthRate}% annually</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
