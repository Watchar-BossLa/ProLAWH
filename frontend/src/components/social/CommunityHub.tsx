
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Zap, Users, Calendar, Target, Gift } from "lucide-react";
import { CommunityChallenge } from "./community/CommunityChallenge";
import { LeaderboardWidget } from "./community/LeaderboardWidget";
import { ExpertOfficeHours } from "./community/ExpertOfficeHours";

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState("challenges");

  const challenges = [
    {
      id: '1',
      title: '30-Day React Challenge',
      description: 'Build 30 different React components in 30 days',
      type: 'skill-building',
      difficulty: 'intermediate',
      participants: 1247,
      timeLeft: '15 days',
      reward: '500 XP + React Master Badge',
      progress: 45,
      isActive: true
    },
    {
      id: '2',
      title: 'Algorithm Mastery Sprint',
      description: 'Solve 100 coding problems across different difficulty levels',
      type: 'problem-solving',
      difficulty: 'advanced',
      participants: 892,
      timeLeft: '22 days',
      reward: '1000 XP + Algorithm Expert Badge',
      progress: 23,
      isActive: true
    },
    {
      id: '3',
      title: 'Open Source Contribution Week',
      description: 'Make meaningful contributions to open source projects',
      type: 'collaboration',
      difficulty: 'all-levels',
      participants: 567,
      timeLeft: '5 days',
      reward: '750 XP + Open Source Contributor Badge',
      progress: 78,
      isActive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Community Hub</h2>
          <p className="text-muted-foreground">
            Join challenges, compete with peers, and learn from experts
          </p>
        </div>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">
            <Trophy className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Zap className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="office-hours">
            <Calendar className="h-4 w-4 mr-2" />
            Expert Hours
          </TabsTrigger>
          <TabsTrigger value="events">
            <Users className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {challenges.map((challenge) => (
                <CommunityChallenge key={challenge.id} challenge={challenge} />
              ))}
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total XP</span>
                    <Badge className="bg-yellow-100 text-yellow-800">2,450 XP</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Badges Earned</span>
                    <Badge className="bg-blue-100 text-blue-800">12 badges</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Streak</span>
                    <Badge className="bg-green-100 text-green-800">15 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Rank</span>
                    <Badge className="bg-purple-100 text-purple-800">#247</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recommended for You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm">TypeScript Basics</h4>
                    <p className="text-xs text-muted-foreground">Based on your React progress</p>
                    <Button size="sm" className="mt-2 w-full">Join Challenge</Button>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-sm">System Design Study</h4>
                    <p className="text-xs text-muted-foreground">Next step in your journey</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardWidget />
        </TabsContent>

        <TabsContent value="office-hours" className="space-y-4">
          <ExpertOfficeHours />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Community Events</h3>
              <p className="text-sm text-muted-foreground">
                Discover upcoming workshops, webinars, and networking events
              </p>
              <Button className="mt-4">View All Events</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
