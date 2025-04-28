
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Leaf, TrendingUp } from 'lucide-react';

interface TopGreenSkillProps {
  skills: Array<{
    name: string;
    category: string;
    co2_reduction_potential: number;
    market_growth_rate: number;
  }>;
}

export function TopGreenSkills({ skills }: TopGreenSkillProps) {
  // Sort skills by CO2 reduction potential
  const topSkills = [...skills]
    .sort((a, b) => b.co2_reduction_potential - a.co2_reduction_potential)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          Top Impact Green Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {topSkills.map((skill) => (
            <Card key={skill.name} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{skill.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{skill.category}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-xs">CO2 Reduction: {skill.co2_reduction_potential}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">Market Growth: {skill.market_growth_rate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
