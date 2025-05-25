
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock, Calendar, MessageCircle, Video } from "lucide-react";

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

interface StudyGroupCardProps {
  group: StudyGroup;
}

export function StudyGroupCard({ group }: StudyGroupCardProps) {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNextMeeting = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <Badge className={`mt-2 ${getSkillLevelColor(group.skill_level)}`}>
              {group.skill_level}
            </Badge>
          </div>
          {group.compatibility_score && (
            <Badge variant="secondary" className="ml-2">
              {group.compatibility_score}% match
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {group.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{group.memberCount}/{group.maxMembers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{group.meetingSchedule}</span>
          </div>
        </div>

        {group.nextMeeting && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Next: {formatNextMeeting(group.nextMeeting)}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {group.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {group.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{group.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="default" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Join Chat
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
