
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Users, Target, Zap, BarChart3 } from 'lucide-react';
import { useAIMatching } from '@/hooks/ai/useAIMatching';
import { BehaviorProfileForm } from './BehaviorProfileForm';
import { SmartOpportunityCard } from './SmartOpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const { 
    behaviorProfile, 
    opportunityMatches, 
    generateMatches, 
    isAnalyzing,
    matchesLoading 
  } = useAIMatching();
  
  const [showProfileForm, setShowProfileForm] = useState(!behaviorProfile);

  // Fetch market intelligence
  const { data: marketData } = useQuery({
    queryKey: ['market-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select(`
          *,
          skill:skills_taxonomy(*)
        `)
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleGenerateMatches = () => {
    generateMatches(mockOpportunities);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Smart Matches</p>
              <p className="text-2xl font-bold">{opportunityMatches?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
              <p className="text-2xl font-bold">
                {opportunityMatches?.length 
                  ? Math.round(opportunityMatches.reduce((acc, m) => acc + m.success_prediction, 0) / opportunityMatches.length * 100)
                  : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Profile Completeness</p>
              <p className="text-2xl font-bold">{behaviorProfile ? '85%' : '20%'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Market Position</p>
              <p className="text-2xl font-bold">Top 15%</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
          
          {matchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[400px] bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockOpportunities.map(opportunity => {
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
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <h2 className="text-2xl font-semibold">Real-Time Market Intelligence</h2>
          
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
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-2xl font-semibold">AI Profile Settings</h2>
          <BehaviorProfileForm onComplete={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
