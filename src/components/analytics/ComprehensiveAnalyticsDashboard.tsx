import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Clock, Target, BookOpen, Trophy, Zap, Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  learningProgress: any[];
  skillDistribution: any[];
  activityTimeline: any[];
  performanceMetrics: any;
  engagementStats: any;
}

export function ComprehensiveAnalyticsDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    learningProgress: [],
    skillDistribution: [],
    activityTimeline: [],
    performanceMetrics: {},
    engagementStats: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate comprehensive analytics data
      const mockData: AnalyticsData = {
        learningProgress: [
          { month: 'Jan', completed: 12, started: 18, mastery: 85 },
          { month: 'Feb', completed: 19, started: 24, mastery: 78 },
          { month: 'Mar', completed: 25, started: 31, mastery: 92 },
          { month: 'Apr', completed: 18, started: 22, mastery: 88 },
          { month: 'May', completed: 22, started: 28, mastery: 95 },
          { month: 'Jun', completed: 28, started: 35, mastery: 91 }
        ],
        skillDistribution: [
          { skill: 'JavaScript', proficiency: 95, growth: 12 },
          { skill: 'React', proficiency: 88, growth: 18 },
          { skill: 'Node.js', proficiency: 76, growth: 25 },
          { skill: 'Python', proficiency: 82, growth: 15 },
          { skill: 'Machine Learning', proficiency: 65, growth: 35 },
          { skill: 'DevOps', proficiency: 71, growth: 22 }
        ],
        activityTimeline: [
          { time: '6 AM', studyTime: 45, focus: 85 },
          { time: '9 AM', studyTime: 120, focus: 92 },
          { time: '12 PM', studyTime: 60, focus: 78 },
          { time: '3 PM', studyTime: 90, focus: 88 },
          { time: '6 PM', studyTime: 150, focus: 95 },
          { time: '9 PM', studyTime: 75, focus: 82 }
        ],
        performanceMetrics: {
          totalHours: 847,
          coursesCompleted: 23,
          skillsImproved: 12,
          averageScore: 92,
          streakDays: 45,
          certificatesEarned: 8
        },
        engagementStats: {
          weeklyGoalCompletion: 89,
          peerInteractions: 156,
          mentorSessions: 12,
          forumPosts: 34,
          projectsCompleted: 7,
          collaborations: 15
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, change, description }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <Badge variant={change > 0 ? "default" : "secondary"} className="mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {change > 0 ? '+' : ''}{change}%
              </Badge>
            )}
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your learning journey and performance
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Study Hours"
          value={data.performanceMetrics.totalHours}
          icon={Clock}
          change={12}
          description="This month"
        />
        <MetricCard
          title="Courses Completed"
          value={data.performanceMetrics.coursesCompleted}
          icon={BookOpen}
          change={8}
          description="Since last month"
        />
        <MetricCard
          title="Skills Improved"
          value={data.performanceMetrics.skillsImproved}
          icon={Target}
          change={15}
          description="Active improvements"
        />
        <MetricCard
          title="Current Streak"
          value={`${data.performanceMetrics.streakDays} days`}
          icon={Zap}
          change={5}
          description="Keep it up!"
        />
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.learningProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Completed"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="started" 
                      stackId="1" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Started"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mastery Scores Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.learningProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mastery" 
                      stroke="#ff7300" 
                      strokeWidth={3}
                      dot={{ fill: '#ff7300', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency & Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.skillDistribution.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">+{skill.growth}%</Badge>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <Progress value={skill.proficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.activityTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="studyTime" fill="#8884d8" name="Study Time (min)" />
                  <Line yAxisId="right" type="monotone" dataKey="focus" stroke="#ff7300" name="Focus Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Weekly Goal Completion"
              value={`${data.engagementStats.weeklyGoalCompletion}%`}
              icon={Target}
            />
            <MetricCard
              title="Peer Interactions"
              value={data.engagementStats.peerInteractions}
              icon={Users}
            />
            <MetricCard
              title="Mentor Sessions"
              value={data.engagementStats.mentorSessions}
              icon={Brain}
            />
            <MetricCard
              title="Forum Posts"
              value={data.engagementStats.forumPosts}
              icon={BookOpen}
            />
            <MetricCard
              title="Projects Completed"
              value={data.engagementStats.projectsCompleted}
              icon={Trophy}
            />
            <MetricCard
              title="Collaborations"
              value={data.engagementStats.collaborations}
              icon={Users}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}