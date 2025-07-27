
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Clock, Gift, Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  participants: number;
  timeLeft: string;
  reward: string;
  progress: number;
  isActive: boolean;
}

interface CommunityChallengeProps {
  challenge: Challenge;
}

export function CommunityChallenge({ challenge }: CommunityChallengeProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      case 'all-levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill-building': return Trophy;
      case 'problem-solving': return Zap;
      case 'collaboration': return Users;
      default: return Trophy;
    }
  };

  const TypeIcon = getTypeIcon(challenge.type);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {challenge.description}
              </p>
            </div>
          </div>
          {challenge.isActive && (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty.replace('-', ' ')}
          </Badge>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{challenge.participants.toLocaleString()} participants</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{challenge.timeLeft} left</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Your Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <Progress value={challenge.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
          <Gift className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            <strong>Reward:</strong> {challenge.reward}
          </span>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            {challenge.progress > 0 ? 'Continue' : 'Join Challenge'}
          </Button>
          <Button variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
