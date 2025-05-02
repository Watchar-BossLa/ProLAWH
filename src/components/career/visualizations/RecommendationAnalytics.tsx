
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CareerRecommendation } from "@/types/career";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

interface RecommendationAnalyticsProps {
  recommendations: CareerRecommendation[];
}

export const RecommendationAnalytics = ({ recommendations }: RecommendationAnalyticsProps) => {
  // Calculate analytics from recommendations
  const analyzeRecommendations = () => {
    // Count recommendations by type
    const typeCount = {
      skill_gap: 0,
      job_match: 0,
      mentor_suggest: 0
    };
    
    // Count recommendations by status
    const statusCount = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      implemented: 0
    };
    
    // Process recommendations
    recommendations.forEach(rec => {
      if (rec.type in typeCount) {
        typeCount[rec.type as keyof typeof typeCount]++;
      }
      
      if (rec.status in statusCount) {
        statusCount[rec.status as keyof typeof statusCount]++;
      }
    });
    
    // Format data for charts
    const typeData = [
      { name: 'Skill Gap', value: typeCount.skill_gap, fill: '#10b981' },
      { name: 'Job Match', value: typeCount.job_match, fill: '#3b82f6' },
      { name: 'Mentorship', value: typeCount.mentor_suggest, fill: '#8b5cf6' }
    ];
    
    const statusData = [
      { name: 'Pending', value: statusCount.pending, fill: '#f59e0b' },
      { name: 'Accepted', value: statusCount.accepted, fill: '#10b981' },
      { name: 'Rejected', value: statusCount.rejected, fill: '#ef4444' },
      { name: 'Implemented', value: statusCount.implemented, fill: '#3b82f6' }
    ];
    
    return { typeData, statusData };
  };
  
  const { typeData, statusData } = analyzeRecommendations();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recommendation Analytics</CardTitle>
        <CardDescription>
          Summary of your career recommendations and implementation progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Recommendation Types</h3>
            <div className="h-[200px]">
              <ChartContainer config={{}}>
                <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Count">
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Status Distribution</h3>
            <div className="h-[200px]">
              <ChartContainer config={{}}>
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Count">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
