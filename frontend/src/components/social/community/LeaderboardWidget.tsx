
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, TrendingUp, Crown } from "lucide-react";

export function LeaderboardWidget() {
  const [timeframe, setTimeframe] = useState('this-week');
  const [category, setCategory] = useState('overall');

  const leaderboardData = [
    {
      rank: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      score: 15420,
      change: '+12%',
      badges: 28,
      streak: 45,
      specialty: 'React Expert'
    },
    {
      rank: 2,
      name: 'Alex Rodriguez',
      avatar: 'AR',
      score: 14850,
      change: '+8%',
      badges: 25,
      streak: 32,
      specialty: 'ML Engineer'
    },
    {
      rank: 3,
      name: 'Mike Johnson',
      avatar: 'MJ',
      score: 14200,
      change: '+15%',
      badges: 22,
      streak: 28,
      specialty: 'Full Stack'
    },
    {
      rank: 4,
      name: 'Emily Wang',
      avatar: 'EW',
      score: 13950,
      change: '+5%',
      badges: 26,
      streak: 38,
      specialty: 'DevOps Pro'
    },
    {
      rank: 5,
      name: 'David Kim',
      avatar: 'DK',
      score: 13720,
      change: '+10%',
      badges: 24,
      streak: 22,
      specialty: 'Data Scientist'
    }
  ];

  const yourRank = {
    rank: 24,
    name: 'You',
    score: 8450,
    change: '+18%',
    badges: 12,
    streak: 15
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="challenges">Challenges</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="contributions">Contributions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          View Full Leaderboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {user.score.toLocaleString()} XP
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {user.change}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{user.badges} badges</span>
                        <span>•</span>
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Rank & Stats */}
        <div className="space-y-4">
          <Card className="border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">#{yourRank.rank}</div>
                <p className="text-sm text-muted-foreground">Global Rank</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {yourRank.change} this week
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total XP</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {yourRank.score.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Badges</span>
                  <Badge variant="outline">{yourRank.badges}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Streak</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {yourRank.streak} days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Complete 5 challenges</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Earn 1000 XP</span>
                  <span>750/1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study 10 hours</span>
                  <span>8.5/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
