
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SkillCell {
  skill: string;
  userLevel: number;
  marketDemand: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function SkillGapHeatMap() {
  const skillGapData = useSkillGapData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'gap' | 'demand' | 'alphabetical'>('gap');

  const skillCells = useMemo<SkillCell[]>(() => {
    if (!skillGapData.length) return [];

    return skillGapData.map(skill => {
      const gap = Math.max(0, skill.marketDemand - skill.userLevel);
      let priority: 'high' | 'medium' | 'low' = 'low';
      
      if (gap >= 3 && skill.marketDemand >= 7) priority = 'high';
      else if (gap >= 2 && skill.marketDemand >= 5) priority = 'medium';

      return {
        skill: skill.subject,
        userLevel: skill.userLevel,
        marketDemand: skill.marketDemand,
        gap,
        priority,
        category: skill.subject.includes('React') || skill.subject.includes('JavaScript') ? 'Frontend' :
                 skill.subject.includes('Python') || skill.subject.includes('Node') ? 'Backend' :
                 skill.subject.includes('Data') || skill.subject.includes('AI') ? 'Data Science' : 'Other'
      };
    });
  }, [skillGapData]);

  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skillCells;
    
    if (selectedCategory !== 'all') {
      filtered = skillCells.filter(skill => skill.category === selectedCategory);
    }

    switch (sortBy) {
      case 'gap':
        return filtered.sort((a, b) => b.gap - a.gap);
      case 'demand':
        return filtered.sort((a, b) => b.marketDemand - a.marketDemand);
      case 'alphabetical':
        return filtered.sort((a, b) => a.skill.localeCompare(b.skill));
      default:
        return filtered;
    }
  }, [skillCells, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = [...new Set(skillCells.map(skill => skill.category))];
    return ['all', ...cats];
  }, [skillCells]);

  const getHeatMapColor = (gap: number, priority: string) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-orange-500';
    if (gap > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getHeatMapIntensity = (gap: number) => {
    const intensity = Math.min(gap / 5, 1);
    return `opacity-${Math.round(intensity * 100)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Skill Gap Heat Map</CardTitle>
            <p className="text-sm text-muted-foreground">
              Visual representation of skill gaps and learning priorities
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gap">Gap Size</SelectItem>
                <SelectItem value="demand">Market Demand</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>On Track</span>
            </div>
          </div>

          {/* Heat Map Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredAndSortedSkills.map((skill) => (
              <TooltipProvider key={skill.skill}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105
                      ${getHeatMapColor(skill.gap, skill.priority)} bg-opacity-20
                      ${skill.priority === 'high' ? 'border-red-500' : 
                        skill.priority === 'medium' ? 'border-orange-500' : 
                        skill.gap > 0 ? 'border-yellow-500' : 'border-green-500'}
                    `}>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm truncate">{skill.skill}</h4>
                        <div className="flex justify-between text-xs">
                          <span>Your Level: {skill.userLevel}</span>
                          <span>Market: {skill.marketDemand}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge 
                            variant={skill.priority === 'high' ? 'destructive' : 
                                   skill.priority === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            Gap: {skill.gap}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{skill.skill}</p>
                      <p>Your Level: {skill.userLevel}/10</p>
                      <p>Market Demand: {skill.marketDemand}/10</p>
                      <p>Gap: {skill.gap} points</p>
                      <p>Priority: {skill.priority}</p>
                      <p>Category: {skill.category}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {filteredAndSortedSkills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No skills found for the selected category.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
