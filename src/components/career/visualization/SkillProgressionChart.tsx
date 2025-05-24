
import { useMemo, useState } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRESET_SKILLS = ["React", "TypeScript", "Machine Learning", "Cloud Architecture", "UX Design"];
const FUTURE_MONTHS = 6; // Number of future months to project

interface OverviewDataPoint {
  month: string;
  current: number | null;
  projected: number;
  marketAverage: number;
}

interface SkillDataPoint {
  month: string;
  skill: string;
  current: number | null;
  projected: number;
  marketLevel: number;
}

export function SkillProgressionChart() {
  const skillGapData = useSkillGapData();
  const [viewType, setViewType] = useState<'overview' | 'specific'>('overview');
  const [selectedSkill, setSelectedSkill] = useState<string>(PRESET_SKILLS[0]);
  
  // Generate progression data for overview and specific skills
  const progressData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const startMonth = currentMonth - 3 < 0 ? currentMonth + 9 : currentMonth - 3; // Show 3 months back
    
    const pastMonths = months.slice(startMonth, startMonth + 3);
    const futureMonths = [];
    for (let i = 0; i < FUTURE_MONTHS; i++) {
      const monthIndex = (startMonth + 3 + i) % 12;
      futureMonths.push(months[monthIndex]);
    }
    
    const allMonths = [...pastMonths, ...futureMonths];
    
    // Get average user level from skill gap data for starting point
    const avgUserLevel = skillGapData.length 
      ? skillGapData.reduce((sum, skill) => sum + skill.userLevel, 0) / skillGapData.length 
      : 5;
    
    const avgMarketDemand = skillGapData.length 
      ? skillGapData.reduce((sum, skill) => sum + skill.marketDemand, 0) / skillGapData.length 
      : 7;
    
    // Generate overview data
    const overviewData: OverviewDataPoint[] = allMonths.map((month, index) => {
      const isPast = index < 3;
      const growthRate = 0.8; // Points gained per month
      
      // For past months, simulate slightly lower progress
      const pastProgress = avgUserLevel - (3 - index) * (growthRate * 0.7);
      // For future months, project based on current level + growth rate
      const futureProgress = avgUserLevel + (index - 2) * growthRate;
      
      return {
        month,
        current: isPast ? Math.max(0, Math.min(10, pastProgress)) : null,
        projected: Math.max(0, Math.min(10, isPast ? pastProgress : futureProgress)),
        marketAverage: Math.min(10, avgMarketDemand + (index - 2) * 0.1),
      };
    });
    
    // Generate individual skill data
    const skillsData: Record<string, SkillDataPoint[]> = {};
    
    PRESET_SKILLS.forEach(skill => {
      // Find this skill in the skill gap data or use default values
      const skillInfo = skillGapData.find(s => s.subject === skill);
      const initialLevel = skillInfo ? skillInfo.userLevel : Math.floor(Math.random() * 5) + 2;
      const marketLevel = skillInfo ? skillInfo.marketDemand : Math.floor(Math.random() * 3) + 7;
      
      // Calculate individual growth rate based on gap
      const gap = marketLevel - initialLevel;
      const growthRate = gap > 3 ? 0.9 : gap > 1 ? 0.7 : 0.5;
      
      skillsData[skill] = allMonths.map((month, index) => {
        const isPast = index < 3;
        const pastProgress = initialLevel - (3 - index) * (growthRate * 0.6);
        const futureProgress = initialLevel + (index - 2) * growthRate;
        
        return {
          month,
          skill,
          current: isPast ? Math.max(0, Math.min(10, pastProgress)) : null,
          projected: Math.max(0, Math.min(10, isPast ? pastProgress : futureProgress)),
          marketLevel: Math.min(10, marketLevel),
        };
      });
    });
    
    return {
      overview: overviewData,
      skills: skillsData
    };
  }, [skillGapData]);

  const chartConfig = useMemo(() => ({
    current: { label: "Current Progress", color: "#10b981" },
    projected: { label: "Projected Growth", color: "#6366f1" },
    marketAverage: { label: "Market Average", color: "#f43f5e" },
    marketLevel: { label: "Market Demand", color: "#f43f5e" },
  }), []);

  const currentData = viewType === 'overview' 
    ? progressData.overview 
    : progressData.skills[selectedSkill];

  // Calculate when skill will meet market demand
  const marketCrossoverPoint = useMemo(() => {
    if (viewType === 'specific' && currentData) {
      const skillData = currentData as SkillDataPoint[];
      const marketLevel = skillData[0]?.marketLevel || 0;
      let monthsToMarket = FUTURE_MONTHS;
      
      for (let i = 0; i < skillData.length; i++) {
        if (skillData[i].projected >= marketLevel) {
          monthsToMarket = i;
          break;
        }
      }
      
      return {
        months: monthsToMarket,
        achieved: monthsToMarket < FUTURE_MONTHS
      };
    }
    return null;
  }, [currentData, viewType]);

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
          
          <div className="flex flex-col sm:flex-row gap-2">
            <ToggleGroup type="single" value={viewType} onValueChange={(val) => val && setViewType(val as 'overview' | 'specific')}>
              <ToggleGroupItem value="overview" size="sm">Overall</ToggleGroupItem>
              <ToggleGroupItem value="specific" size="sm">By Skill</ToggleGroupItem>
            </ToggleGroup>
            
            {viewType === 'specific' && (
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_SKILLS.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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
        
        {viewType === 'specific' && marketCrossoverPoint && (
          <div className="mt-4 pt-2 border-t">
            <p className="text-sm">
              <span className="font-medium">Market Gap Analysis:</span>{' '}
              {marketCrossoverPoint.achieved ? (
                <span className="text-green-500">
                  You will reach market demand in approximately {marketCrossoverPoint.months} month{marketCrossoverPoint.months !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-amber-500">
                  You need to accelerate your learning to reach market demand within 6 months
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
