import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Brain, 
  Zap, 
  Target,
  Activity,
  TrendingUp,
  MessageSquare,
  Calendar,
  Briefcase,
  Bot,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { useDashboardStats, useRecommendations } from "@/hooks/useApi";

export function SimpleDashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: recommendations, loading: recommendationsLoading, refetch: refetchRecommendations } = useRecommendations();

  // Auto-refresh recommendations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRecommendations();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchRecommendations]);

  const quickActions = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Start Learning",
      description: "Begin or continue your courses",
      action: () => navigate("/dashboard/learning"),
      color: "bg-blue-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Find Mentor", 
      description: "Connect with experienced professionals",
      action: () => navigate("/dashboard/mentorship"),
      color: "bg-purple-500"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Browse Jobs",
      description: "Explore career opportunities",
      action: () => navigate("/dashboard/opportunities"),
      color: "bg-green-500"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Take Assessment",
      description: "Test and verify your skills",
      action: () => navigate("/dashboard/skills"),
      color: "bg-orange-500"
    }
  ];

  const recentActivities = [
    { icon: <BookOpen className="h-4 w-4" />, text: "Completed React Fundamentals", time: "2 hours ago" },
    { icon: <Users className="h-4 w-4" />, text: "Connected with Sarah Johnson", time: "1 day ago" },
    { icon: <Trophy className="h-4 w-4" />, text: "Earned Problem Solver badge", time: "2 days ago" },
    { icon: <MessageSquare className="h-4 w-4" />, text: "New mentorship message", time: "3 days ago" },
  ];

  // Loading states
  if (statsLoading && recommendationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your learning journey.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          🌟 ProLawh Platform
        </Badge>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mb-2`}>
                {action.icon}
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Stats and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Recommendations
              </div>
              <Button variant="ghost" size="sm" onClick={refetchRecommendations}>
                <RefreshCw className={`h-4 w-4 ${recommendationsLoading ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendationsLoading ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating personalized recommendations...</span>
                </div>
              ) : (
                recommendations?.courses?.slice(0, 2).map((course: any, index: number) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.reason}</p>
                    {course.match_score && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {Math.round(course.match_score * 100)}% match
                      </Badge>
                    )}
                  </div>
                )) || (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">No recommendations available</p>
                    <p className="text-xs text-muted-foreground">Complete your profile for better suggestions</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>React</span>
                <span>7/9 - 78%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>JavaScript Mastery</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded">
                <div className="bg-green-500 h-2 rounded" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>TypeScript</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded">
                <div className="bg-purple-500 h-2 rounded" style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Courses Completed</span>
              <Badge variant="secondary">{stats?.courses_completed || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Skills Verified</span>
              <Badge variant="secondary">{stats?.skills_verified || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Network Connections</span>
              <Badge variant="secondary">{stats?.network_connections || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Learning Streak</span>
              <Badge variant="secondary">{stats?.learning_streak || 0} days</Badge>
            </div>
            {stats?.total_learning_hours && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Learning Hours</span>
                <Badge variant="secondary">{Math.round(stats.total_learning_hours)}h</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to level up your skills?</h3>
              <p className="text-muted-foreground">
                Explore new courses, connect with mentors, and advance your career with AI-powered recommendations.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/dashboard/learning")}>
                Explore Courses
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard/career-twin")}>
                Get AI Advice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}