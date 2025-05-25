
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, Clock } from "lucide-react";

export function LearningProgressAnalytics() {
  const skillGapData = useSkillGapData();

  const analytics = useMemo(() => {
    if (!skillGapData.length) return null;

    const totalSkills = skillGapData.length;
    const avgUserLevel = skillGapData.reduce((sum, skill) => sum + skill.userLevel, 0) / totalSkills;
    const avgMarketDemand = skillGapData.reduce((sum, skill) => sum + skill.marketDemand, 0) / totalSkills;
    const skillsAboveMarket = skillGapData.filter(skill => skill.userLevel >= skill.marketDemand).length;
    const skillsNeedingWork = skillGapData.filter(skill => skill.marketDemand - skill.userLevel >= 2).length;
    
    const progressData = skillGapData.slice(0, 6).map((skill, index) => ({
      skill: skill.subject,
      current: skill.userLevel,
      target: skill.marketDemand,
      progress: (skill.userLevel / skill.marketDemand) * 100
    }));

    const skillDistribution = [
      { name: 'Beginner (1-3)', value: skillGapData.filter(s => s.userLevel <= 3).length, color: '#ef4444' },
      { name: 'Intermediate (4-6)', value: skillGapData.filter(s => s.userLevel >= 4 && s.userLevel <= 6).length, color: '#f59e0b' },
      { name: 'Advanced (7-8)', value: skillGapData.filter(s => s.userLevel >= 7 && s.userLevel <= 8).length, color: '#10b981' },
      { name: 'Expert (9-10)', value: skillGapData.filter(s => s.userLevel >= 9).length, color: '#3b82f6' }
    ];

    const monthlyProgress = [
      { month: 'Jan', avgLevel: avgUserLevel - 1.2, completedCourses: 2 },
      { month: 'Feb', avgLevel: avgUserLevel - 1.0, completedCourses: 3 },
      { month: 'Mar', avgLevel: avgUserLevel - 0.8, completedCourses: 2 },
      { month: 'Apr', avgLevel: avgUserLevel - 0.5, completedCourses: 4 },
      { month: 'May', avgLevel: avgUserLevel - 0.2, completedCourses: 3 },
      { month: 'Jun', avgLevel: avgUserLevel, completedCourses: 2 }
    ];

    return {
      totalSkills,
      avgUserLevel,
      avgMarketDemand,
      skillsAboveMarket,
      skillsNeedingWork,
      progressData,
      skillDistribution,
      monthlyProgress,
      overallProgress: (avgUserLevel / avgMarketDemand) * 100
    };
  }, [skillGapData]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No data available for analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <p className="text-2xl font-bold">{analytics.totalSkills}</p>
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Skill Level</p>
                <p className="text-2xl font-bold">{analytics.avgUserLevel.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Above Market</p>
                <p className="text-2xl font-bold text-green-600">{analytics.skillsAboveMarket}</p>
              </div>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Focus</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.skillsNeedingWork}</p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Learning Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your progress toward market-level competency
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={analytics.overallProgress} className="flex-1" />
              <span className="text-sm font-medium">{analytics.overallProgress.toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Average: </span>
                <span className="font-medium">{analytics.avgUserLevel.toFixed(1)}/10</span>
              </div>
              <div>
                <span className="text-muted-foreground">Market Average: </span>
                <span className="font-medium">{analytics.avgMarketDemand.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgLevel" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Average Skill Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Skill Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Progress toward market expectations for your top skills
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.progressData.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {skill.current}/{skill.target}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {skill.progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
