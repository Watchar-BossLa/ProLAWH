
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  LineChart, 
  Trophy, 
  Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to ProLawh, your AI-native ecosystem for personalized education and work opportunities.
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Acquired</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start your learning journey today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentor Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Connect with industry experts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No upcoming events scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Complete challenges to earn badges
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Features Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recommended Learning Paths</CardTitle>
            <CardDescription>
              Personalized recommendations based on your profile and career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Web Development Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">12 courses • 24 hours</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Beginner level
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/learning">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Data Science Essentials</h4>
                  <p className="text-sm text-muted-foreground">8 courses • 16 hours</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Intermediate level
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/learning">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Career Twin</CardTitle>
            <CardDescription>
              Get personalized career insights powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 rounded-md border border-dashed flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                  Complete your profile to activate your AI Career Twin
                </p>
              </div>
            </div>
            
            <Button className="w-full" asChild>
              <Link to="/dashboard/career">
                Setup Career Twin
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
