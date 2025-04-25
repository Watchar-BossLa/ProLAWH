
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Leaf, TrendingUp } from 'lucide-react';

export interface GreenSkillsListProps {
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

export const GreenSkillsList: React.FC<GreenSkillsListProps> = ({ skills }) => {
  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <div className="p-4 grid gap-4">
        {skills.length > 0 ? (
          skills.map(skill => (
            <Card key={skill.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{skill.name}</h3>
                    <CardDescription className="mb-4">{skill.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {skill.category}
                  </Badge>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      CO2 Reduction: {skill.co2_reduction_potential}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Market Growth: {skill.market_growth_rate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No green skills found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
