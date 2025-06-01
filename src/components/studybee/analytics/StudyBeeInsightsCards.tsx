
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyBeeProgress } from '@/integrations/studybee/types';
import { TrendingUp } from "lucide-react";

interface StudyBeeInsightsCardsProps {
  progress: StudyBeeProgress;
}

export function StudyBeeInsightsCards({ progress }: StudyBeeInsightsCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Study Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Retention Rate</p>
              <p className="text-sm text-muted-foreground">Knowledge retention from sessions</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{progress.performance_metrics.retention_rate}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Quiz Performance</p>
              <p className="text-sm text-muted-foreground">Average quiz scores</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{progress.performance_metrics.quiz_average}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Study Diversity</p>
              <p className="text-sm text-muted-foreground">Different subjects studied</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{progress.subjects_studied.length}</div>
              <p className="text-xs text-muted-foreground">subjects</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
