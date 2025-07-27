
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudyBeeProgress } from '@/integrations/studybee/types';
import { Award } from "lucide-react";

interface StudyBeeAchievementsListProps {
  progress: StudyBeeProgress;
}

export function StudyBeeAchievementsList({ progress }: StudyBeeAchievementsListProps) {
  if (progress.achievements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {progress.achievements.slice(0, 4).map((achievement, index) => (
            <Badge key={index} variant="secondary" className="justify-start">
              🏆 {achievement}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
