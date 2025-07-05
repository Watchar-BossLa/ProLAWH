
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap } from 'lucide-react';
import { BehaviorProfileForm } from './BehaviorProfileForm';
import { AIMatchingStats } from './matching/AIMatchingStats';
import { OpportunityMatchGrid } from './matching/OpportunityMatchGrid';
import { MarketInsightsPanel } from './matching/MarketInsightsPanel';
import { useBehaviorProfile } from '@/hooks/ai/useBehaviorProfile';
import { useOpportunityMatching } from '@/hooks/ai/useOpportunityMatching';
import { useMarketIntelligence } from '@/hooks/ai/useMarketIntelligence';

// Mock opportunities for demo
const mockOpportunities = [
  {
    id: "1",
    title: "Senior React Developer",
    description: "Build next-generation web applications using React, TypeScript, and modern development practices.",
    company: "TechCorp",
    rate_range: "$80-120/hr",
    skills_required: ["React", "TypeScript", "Node.js", "GraphQL"],
    is_remote: true,
    has_insurance: true,
    green_score: 45,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "ML Engineer - Climate Tech",
    description: "Apply machine learning to solve climate challenges and build sustainable technology solutions.",
    company: "GreenAI",
    rate_range: "$100-150/hr",
    skills_required: ["Python", "Machine Learning", "TensorFlow", "Climate Science"],
    is_remote: true,
    has_insurance: true,
    green_score: 95,
    created_at: new Date().toISOString()
  }
];

export function AIMatchingDashboard() {
  const { behaviorProfile } = useBehaviorProfile();
  const { opportunityMatches, generateMatches, isAnalyzing, matchesLoading } = useOpportunityMatching();
  const { marketData } = useMarketIntelligence();
  const [showProfileForm, setShowProfileForm] = useState(!behaviorProfile);

  const handleGenerateMatches = () => {
    generateMatches(mockOpportunities);
  };

  const profileCompleteness = behaviorProfile ? 85 : 20;

  if (showProfileForm) {
    return (
      <div className="container mx-auto py-8">
        <BehaviorProfileForm onComplete={() => setShowProfileForm(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Career Intelligence</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our advanced AI analyzes your skills, preferences, and market trends to find perfect opportunities and predict your success rate.
        </p>
      </div>

      {/* Stats Cards */}
      <AIMatchingStats 
        opportunityMatches={opportunityMatches} 
        profileCompleteness={profileCompleteness}
      />

      {/* Main Content */}
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">AI Matches</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your AI-Powered Matches</h2>
            <Button 
              onClick={handleGenerateMatches}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Generate New Matches'}
            </Button>
          </div>
          
          <OpportunityMatchGrid 
            opportunities={mockOpportunities}
            opportunityMatches={opportunityMatches}
            isLoading={matchesLoading}
          />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <h2 className="text-2xl font-semibold">Real-Time Market Intelligence</h2>
          <MarketInsightsPanel marketData={marketData} />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-2xl font-semibold">AI Profile Settings</h2>
          <BehaviorProfileForm onComplete={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
