
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users } from "lucide-react";
import { StudyGroupCard } from "./StudyGroupCard";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting?: string;
  tags: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  compatibility_score?: number;
}

interface StudyGroupRecommendationsProps {
  groups: StudyGroup[];
}

export function StudyGroupRecommendations({ groups }: StudyGroupRecommendationsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">AI-Powered Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800 mb-4">
            Based on your learning goals, skill gaps, and activity patterns, here are study groups that would accelerate your progress:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Skill Gap Alignment
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              Learning Style Match
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              Schedule Compatibility
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <StudyGroupCard key={group.id} group={group} />
        ))}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete your profile and learning assessments to get personalized study group recommendations
            </p>
            <Button className="mt-4">Complete Profile</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
