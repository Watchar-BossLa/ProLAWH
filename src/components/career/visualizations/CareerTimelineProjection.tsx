
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addMonths, format } from 'date-fns';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

// Generate timeline projection data based on user's career growth path
const generateTimelineData = () => {
  const today = new Date();
  const data = [];
  
  // Generate data for 12 months
  for (let i = 0; i < 12; i++) {
    const date = addMonths(today, i);
    
    // Calculate projected values
    const baseSkill = 60 + Math.floor(i * 3);
    const enhancedSkill = 60 + Math.floor(i * 5);
    
    // Simulate market relevance scores
    const baseSalary = 85000 + (i * 1200);
    const enhancedSalary = 85000 + (i * 2500);
    
    data.push({
      month: format(date, 'MMM yyyy'),
      baseSkillGrowth: baseSkill,
      enhancedSkillGrowth: Math.min(enhancedSkill, 100),
      baseSalary: baseSalary / 1000,
      enhancedSalary: enhancedSalary / 1000,
    });
  }
  
  return data;
};

export const CareerTimelineProjection = () => {
  const timelineData = generateTimelineData();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Career Growth Projection</CardTitle>
        <CardDescription>
          Estimated skill growth and salary potential over the next 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            config={{
              baseSkillGrowth: { color: "#94a3b8" },
              enhancedSkillGrowth: { color: "#10b981" },
              baseSalary: { color: "#cbd5e1" },
              enhancedSalary: { color: "#3b82f6" },
            }}
          >
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line 
                type="monotone" 
                dataKey="baseSkillGrowth" 
                name="Skill Growth (Current Path)" 
                stroke="var(--color-baseSkillGrowth)" 
                yAxisId="left"
              />
              <Line 
                type="monotone" 
                dataKey="enhancedSkillGrowth" 
                name="Skill Growth (With Recommendations)" 
                stroke="var(--color-enhancedSkillGrowth)" 
                yAxisId="left"
              />
              <Line 
                type="monotone" 
                dataKey="baseSalary" 
                name="Salary Potential ($K)" 
                stroke="var(--color-baseSalary)" 
                yAxisId="right"
              />
              <Line 
                type="monotone" 
                dataKey="enhancedSalary" 
                name="Enhanced Salary ($K)" 
                stroke="var(--color-enhancedSalary)" 
                yAxisId="right"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
