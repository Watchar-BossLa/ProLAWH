
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MarketIntelligence } from '@/types/ai-matching';

interface MarketInsightsPanelProps {
  marketData: MarketIntelligence[];
}

export function MarketInsightsPanel({ marketData }: MarketInsightsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {marketData?.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">{item.skill?.name}</CardTitle>
            <CardDescription>{item.region}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Demand Score</span>
                <span className="font-semibold">{(item.demand_score * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Average Rate</span>
                <span className="font-semibold">${item.avg_rate_usd}/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Trend</span>
                <Badge variant={
                  item.trend_direction === 'rising' ? 'default' : 
                  item.trend_direction === 'stable' ? 'secondary' : 'destructive'
                }>
                  {item.trend_direction}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
