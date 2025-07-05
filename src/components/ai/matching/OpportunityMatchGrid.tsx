
import React from 'react';
import { SmartOpportunityCard } from '../SmartOpportunityCard';
import type { OpportunityMatch } from '@/types/ai-matching';

interface OpportunityMatchGridProps {
  opportunities: any[];
  opportunityMatches: OpportunityMatch[];
  isLoading: boolean;
}

export function OpportunityMatchGrid({ opportunities, opportunityMatches, isLoading }: OpportunityMatchGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[400px] bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {opportunities.map(opportunity => {
        const matchData = opportunityMatches?.find(m => m.opportunity_id === opportunity.id);
        return (
          <SmartOpportunityCard 
            key={opportunity.id}
            opportunity={opportunity}
            matchData={matchData}
          />
        );
      })}
    </div>
  );
}
