
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudyBeeSession } from '@/integrations/studybee/types';
import { BookOpen } from "lucide-react";

interface StudyBeeSubjectDistributionProps {
  sessions: StudyBeeSession[];
}

export function StudyBeeSubjectDistribution({ sessions }: StudyBeeSubjectDistributionProps) {
  const subjectDistribution = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration_minutes;
    return acc;
  }, {} as Record<string, number>);

  const topSubjects = Object.entries(subjectDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Top Study Subjects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSubjects.map(([subject, minutes], index) => (
            <div key={subject} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <span className="font-medium">{subject}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(minutes / 60 * 10) / 10}h
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
