
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Clock, Target, TrendingUp, Zap } from "lucide-react";

export function PerformanceMetricsDashboard() {
  const performanceData = useMemo(() => {
    // Mock data - in real app this would come from actual analytics
    return {
      learningVelocity: 8.5, // skills learned per month
      retentionRate: 92, // percentage of knowledge retained
      applicationRate: 78, // percentage of skills applied in projects
      engagementScore: 85, // overall engagement with platform
      
      weeklyActivity: [
        { week: 'Week 1', studyHours: 12, completedChallenges: 3, skillPoints: 150 },
        { week: 'Week 2', studyHours: 15, completedChallenges: 4, skillPoints: 200 },
        { week: 'Week 3', studyHours: 18, completedChallenges: 5, skillPoints: 275 },
        { week: 'Week 4', studyHours: 14, completedChallenges: 3, skillPoints: 180 }
      ],
      
      skillCategories: [
        { category: 'Technical Skills', score: 85 },
        { category: 'Problem Solving', score: 78 },
        { category: 'Communication', score: 72 },
        { category: 'Project Management', score: 68 },
        { category: 'Leadership', score: 65 },
        { category: 'Innovation', score: 80 }
      ],
      
      learningGoals: [
        { goal: 'Complete React Advanced Course', progress: 85, target: 100, deadline: '2 weeks' },
        { goal: 'Build 3 Portfolio Projects', progress: 66, target: 100, deadline: '1 month' },
        { goal: 'Earn 5 Skill Badges', progress: 80, target: 100, deadline: '3 weeks' },
        { goal: 'Mentor 2 Junior Developers', progress: 50, target: 100, deadline: '2 months' }
      ],
      
      streakData: {
        currentStreak: 12,
        longestStreak: 25,
        totalDays: 89
      }
    };
  }, []);

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-500' };
    if (score >= 80) return { level: 'Good', color: 'bg-blue-500' };
    if (score >= 70) return { level: 'Average', color: 'bg-yellow-500' };
    return { level: 'Needs Improvement', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Velocity</p>
                <p className="text-2xl font-bold">{performanceData.learningVelocity}</p>
                <p className="text-xs text-muted-foreground">skills/month</p>
              </div>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-bold">{performanceData.retentionRate}%</p>
                <Badge className={getPerformanceLevel(performanceData.retentionRate).color}>
                  {getPerformanceLevel(performanceData.retentionRate).level}
                </Badge>
              </div>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Application Rate</p>
                <p className="text-2xl font-bold">{performanceData.applicationRate}%</p>
                <p className="text-xs text-muted-foreground">skills applied</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{performanceData.streakData.currentStreak}</p>
                <p className="text-xs text-muted-foreground">days active</p>
              </div>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Study hours, challenges completed, and skill points earned
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="studyHours" fill="#3b82f6" name="Study Hours" />
                  <Bar dataKey="completedChallenges" fill="#10b981" name="Challenges" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Category Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Performance breakdown across different skill areas
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData.skillCategories}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <Radar
                    name="Performance Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Goals Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your progress toward personal learning objectives
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.learningGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.goal}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {goal.deadline}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {goal.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Strengths</h4>
              <ul className="text-sm space-y-1">
                <li>• Consistent daily learning habit</li>
                <li>• High retention rate (92%)</li>
                <li>• Strong technical skill development</li>
                <li>• Active in practical applications</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">Areas for Improvement</h4>
              <ul className="text-sm space-y-1">
                <li>• Communication skills development</li>
                <li>• Leadership experience needed</li>
                <li>• Project management skills</li>
                <li>• Networking and mentorship</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Recommendations</h4>
              <ul className="text-sm space-y-1">
                <li>• Join a study group or community</li>
                <li>• Take on a leadership role</li>
                <li>• Start mentoring others</li>
                <li>• Focus on soft skills training</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
