
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Brain, TrendingUp, Target, Clock } from "lucide-react";

interface CareerPath {
  title: string;
  probability: number;
  timeframe: string;
  requiredSkills: string[];
  salaryRange: { min: number; max: number };
  marketGrowth: number;
}

interface SkillTrajectory {
  month: string;
  currentLevel: number;
  projectedLevel: number;
  marketDemand: number;
}

export function PredictiveCareerModel() {
  const skillGapData = useSkillGapData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('2-years');
  const [focusArea, setFocusArea] = useState<string>('all');

  const careerPaths = useMemo<CareerPath[]>(() => {
    if (!skillGapData.length) return [];

    const avgSkillLevel = skillGapData.reduce((sum, skill) => sum + skill.userLevel, 0) / skillGapData.length;
    const strongSkills = skillGapData.filter(skill => skill.userLevel >= 7).map(s => s.subject);
    
    return [
      {
        title: 'Senior Frontend Developer',
        probability: strongSkills.some(s => s.includes('React') || s.includes('JavaScript')) ? 85 : 45,
        timeframe: '12-18 months',
        requiredSkills: ['Advanced React', 'TypeScript', 'State Management', 'Testing'],
        salaryRange: { min: 95000, max: 130000 },
        marketGrowth: 12
      },
      {
        title: 'Full-Stack Tech Lead',
        probability: avgSkillLevel >= 6 ? 75 : 35,
        timeframe: '18-24 months',
        requiredSkills: ['System Design', 'Team Leadership', 'Backend Architecture', 'DevOps'],
        salaryRange: { min: 120000, max: 160000 },
        marketGrowth: 15
      },
      {
        title: 'Data Science Engineer',
        probability: strongSkills.some(s => s.includes('Python') || s.includes('Data')) ? 70 : 25,
        timeframe: '2-3 years',
        requiredSkills: ['Machine Learning', 'Statistics', 'Big Data', 'Python'],
        salaryRange: { min: 110000, max: 150000 },
        marketGrowth: 22
      },
      {
        title: 'Engineering Manager',
        probability: avgSkillLevel >= 7 ? 65 : 20,
        timeframe: '3-4 years',
        requiredSkills: ['People Management', 'Strategic Planning', 'Technical Leadership', 'Communication'],
        salaryRange: { min: 140000, max: 180000 },
        marketGrowth: 8
      },
      {
        title: 'Solutions Architect',
        probability: strongSkills.length >= 3 ? 60 : 30,
        timeframe: '2-4 years',
        requiredSkills: ['Cloud Architecture', 'System Design', 'Enterprise Patterns', 'Security'],
        salaryRange: { min: 130000, max: 170000 },
        marketGrowth: 18
      }
    ].sort((a, b) => b.probability - a.probability);
  }, [skillGapData]);

  const skillTrajectories = useMemo<SkillTrajectory[]>(() => {
    if (!skillGapData.length) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const topSkills = skillGapData.slice(0, 3);

    return months.map((month, index) => {
      const avgCurrent = topSkills.reduce((sum, skill) => sum + skill.userLevel, 0) / topSkills.length;
      const avgMarket = topSkills.reduce((sum, skill) => sum + skill.marketDemand, 0) / topSkills.length;
      
      // Simulate growth trajectory
      const progressRate = 0.3; // 30% improvement per month with dedicated learning
      const projectedGrowth = avgCurrent + (index * progressRate);
      
      return {
        month,
        currentLevel: avgCurrent,
        projectedLevel: Math.min(10, projectedGrowth),
        marketDemand: avgMarket
      };
    });
  }, [skillGapData]);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-500';
    if (probability >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMarketGrowthBadge = (growth: number) => {
    if (growth >= 20) return { variant: 'default' as const, text: 'High Growth' };
    if (growth >= 10) return { variant: 'secondary' as const, text: 'Growing' };
    return { variant: 'outline' as const, text: 'Stable' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <CardTitle>Predictive Career Model</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="2-years">2 Years</SelectItem>
                  <SelectItem value="5-years">5 Years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered career path predictions based on your current skills and market trends
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {careerPaths.map((path, index) => (
              <div key={path.title} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{path.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{path.timeframe}</span>
                      <Badge {...getMarketGrowthBadge(path.marketGrowth)}>
                        {getMarketGrowthBadge(path.marketGrowth).text}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${path.salaryRange.min.toLocaleString()} - ${path.salaryRange.max.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {path.marketGrowth}% market growth
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Probability:</span>
                    <Progress value={path.probability} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{path.probability}%</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {path.requiredSkills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skill Development Trajectory
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Projected skill growth over the next 12 months
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={skillTrajectories}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="currentLevel" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorCurrent)" 
                  name="Current Level"
                />
                <Area 
                  type="monotone" 
                  dataKey="projectedLevel" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorProjected)" 
                  name="Projected Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="marketDemand" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  name="Market Demand"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Next Career Milestone</span>
              </div>
              <p className="text-lg font-semibold">{careerPaths[0]?.title || 'Keep Learning!'}</p>
              <p className="text-sm text-muted-foreground">
                {careerPaths[0]?.timeframe || 'Based on current progress'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Avg. Probability</span>
              </div>
              <p className="text-lg font-semibold">
                {Math.round(careerPaths.reduce((sum, path) => sum + path.probability, 0) / careerPaths.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Success likelihood</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Est. Timeline</span>
              </div>
              <p className="text-lg font-semibold">18 months</p>
              <p className="text-sm text-muted-foreground">To next level</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
