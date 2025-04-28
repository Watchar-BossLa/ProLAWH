
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ImpactVisualizationProps {
  environmentalImpact: {
    category: string;
    value: number;
    color: string;
  }[];
  totalReduction: number;
}

export function ImpactVisualization({ environmentalImpact, totalReduction }: ImpactVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Environmental Impact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-green-600">{totalReduction}kg</span>
          <p className="text-sm text-muted-foreground">Potential CO2 Reduction</p>
        </div>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={environmentalImpact}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {environmentalImpact.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}kg CO2`, name]}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {environmentalImpact.map((entry) => (
            <div key={entry.category} className="flex items-center gap-2">
              <div style={{ backgroundColor: entry.color }} className="w-3 h-3 rounded-full" />
              <span className="text-sm">{entry.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
