
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface GreenSkillStatsProps {
  skills: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    co2_reduction_potential: number;
    market_growth_rate: number;
    created_at: string;
    updated_at: string;
  }>;
}

export const GreenSkillStats: React.FC<GreenSkillStatsProps> = ({ skills }) => {
  // Calculate average CO2 reduction potential
  const avgCO2Reduction = skills.length > 0 
    ? skills.reduce((sum, skill) => sum + skill.co2_reduction_potential, 0) / skills.length
    : 0;
  
  // Calculate average market growth rate
  const avgMarketGrowth = skills.length > 0
    ? skills.reduce((sum, skill) => sum + skill.market_growth_rate, 0) / skills.length
    : 0;
  
  // Prepare data for chart
  const chartData = skills
    .map(skill => ({
      name: skill.name,
      co2Reduction: skill.co2_reduction_potential,
      marketGrowth: skill.market_growth_rate
    }))
    .slice(0, 5); // Only show top 5 skills for clarity
  
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Green Skills Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Green Skills:</span>
              <span className="font-semibold">{skills.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Avg CO2 Reduction Potential:</span>
              <span className="font-semibold">{avgCO2Reduction.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Avg Market Growth Rate:</span>
              <span className="font-semibold">{avgMarketGrowth.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Green Skills</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="co2Reduction" name="CO2 Reduction" fill="#34d399" />
              <Bar dataKey="marketGrowth" name="Market Growth" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
