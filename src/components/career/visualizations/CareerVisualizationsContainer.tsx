
import React, { useState, useEffect } from 'react';
import { CareerSkillsRadarChart } from './CareerSkillsRadarChart';
import { CareerTimelineProjection } from './CareerTimelineProjection';
import { RecommendationAnalytics } from './RecommendationAnalytics';
import { ImplementationProgressTracker } from './ImplementationProgressTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useCareerTwin, CareerRecommendation, ImplementationPlan } from '@/hooks/useCareeriTwin';
import { useImplementationPlans } from '@/hooks/useImplementationPlans';

export const CareerVisualizationsContainer = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [plans, setPlans] = useState<ImplementationPlan[]>([]);
  const { getRecommendations, loading } = useCareerTwin();
  const { getImplementationPlans } = useImplementationPlans();
  
  // Fetch recommendations and plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recommendations
        const recData = await getRecommendations();
        if (recData) {
          setRecommendations(recData);
        }
        
        // Fetch implementation plans
        const planData = await getImplementationPlans();
        if (planData) {
          setPlans(planData);
        }
      } catch (error) {
        console.error('Error fetching data for visualizations:', error);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <Card className="w-full h-[400px] flex items-center justify-center">Loading visualizations...</Card>;
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="skills">Skills Gap</TabsTrigger>
        <TabsTrigger value="timeline">Career Timeline</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>
      
      <TabsContent value="skills" className="mt-0">
        <CareerSkillsRadarChart />
      </TabsContent>
      
      <TabsContent value="timeline" className="mt-0">
        <CareerTimelineProjection />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0">
        <RecommendationAnalytics recommendations={recommendations} />
      </TabsContent>
      
      <TabsContent value="progress" className="mt-0">
        <ImplementationProgressTracker plans={plans} />
      </TabsContent>
    </Tabs>
  );
};
