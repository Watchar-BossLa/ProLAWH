
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          Skills Directory
        </CardTitle>
        <CardDescription>
          Browse and explore green skills with their environmental impact metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-6 space-y-4">
            {skills.length > 0 ? (
              skills.map(skill => (
                <Card key={skill.id} className="transition-all duration-200 hover:shadow-md border-l-4 border-l-green-500/20 hover:border-l-green-500/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight text-foreground truncate">
                            {skill.name}
                          </h3>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {skill.description}
                        </p>
                        
                        {/* Metrics */}
                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20">
                              <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <span className="text-muted-foreground">CO₂ Reduction:</span>
                              <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                                {skill.co2_reduction_potential}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20">
                              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-muted-foreground">Market Growth:</span>
                              <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">
                                {skill.market_growth_rate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-muted">
                  <Leaf className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Skills Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  No green skills match your current criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
