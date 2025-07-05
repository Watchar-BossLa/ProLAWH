
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Users, BarChart3 } from 'lucide-react';
import type { OpportunityMatch } from '@/types/ai-matching';

interface AIMatchingStatsProps {
  opportunityMatches: OpportunityMatch[];
  profileCompleteness: number;
}

export function AIMatchingStats({ opportunityMatches, profileCompleteness }: AIMatchingStatsProps) {
  const avgSuccessRate = opportunityMatches?.length 
    ? Math.round(opportunityMatches.reduce((acc, m) => acc + (m.success_prediction || 0), 0) / opportunityMatches.length * 100)
    : 0;

  const stats = [
    {
      icon: Target,
      label: 'Smart Matches',
      value: opportunityMatches?.length || 0,
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Avg Success Rate',
      value: `${avgSuccessRate}%`,
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Profile Completeness',
      value: `${profileCompleteness}%`,
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      label: 'Market Position',
      value: 'Top 15%',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex items-center p-6">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
