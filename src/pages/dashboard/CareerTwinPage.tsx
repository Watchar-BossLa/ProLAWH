
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCareerTwin } from "@/hooks/useCareerTwin";
import { toast } from "sonner";
import { CareerTwinPageHeader } from "@/components/career/dashboard/CareerTwinPageHeader";
import { CareerInsightCards } from "@/components/career/dashboard/CareerInsightCards";
import { RecentCareerInsights } from "@/components/career/dashboard/RecentCareerInsights";
import { RecommendationsTabContent } from "@/components/career/dashboard/RecommendationsTabContent";
import { ImplementationPlansTab } from "@/components/career/dashboard/ImplementationPlansTab";

export default function CareerTwinPage() {
  const [activeTab, setActiveTab] = useState("insights");
  const { 
    recommendations, 
    isLoading, 
    generateRecommendation, 
    updateRecommendation,
    createImplementationPlan,
    trackActivity
  } = useCareerTwin();
  
  // Filter recommendations by status
  const pendingRecommendations = recommendations?.filter(rec => rec.status === 'pending') || [];
  const acceptedRecommendations = recommendations?.filter(rec => rec.status === 'accepted') || [];
  const implementedRecommendations = recommendations?.filter(rec => rec.status === 'implemented') || [];
  
  const handleStatusUpdate = async (id: string, status: "pending" | "accepted" | "rejected" | "implemented") => {
    try {
      await updateRecommendation.mutateAsync({ id, status });
      trackActivity('status_update', { recommendation_id: id, new_status: status });
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };
  
  const handleCreatePlan = async (
    recommendationId: string, 
    data: { title: string; description: string; steps: string[] }
  ) => {
    try {
      await createImplementationPlan.mutateAsync({
        recommendationId,
        title: data.title,
        description: data.description,
        steps: data.steps
      });
      trackActivity('implementation_plan_created', { recommendation_id: recommendationId });
    } catch (error) {
      console.error('Failed to create implementation plan:', error);
    }
  };
  
  const handleGenerateRecommendation = async () => {
    try {
      await generateRecommendation.mutateAsync();
      toast.success("New career recommendation generated!");
      trackActivity('manual_generation');
    } catch (error) {
      toast.error("Failed to generate recommendation. Please try again.");
      console.error('Failed to generate recommendation:', error);
    }
  };

  return (
    <div className="space-y-8">
      <CareerTwinPageHeader 
        onGenerateRecommendation={handleGenerateRecommendation}
        isGenerating={generateRecommendation.isPending}
      />
      
      <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations ({recommendations?.length || 0})</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <CareerInsightCards setActiveTab={setActiveTab} />
          
          <RecentCareerInsights 
            isLoading={isLoading}
            recommendations={recommendations}
            setActiveTab={setActiveTab}
            onStatusUpdate={handleStatusUpdate}
            onCreatePlan={handleCreatePlan}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationsTabContent 
            pendingRecommendations={pendingRecommendations}
            acceptedRecommendations={acceptedRecommendations}
            implementedRecommendations={implementedRecommendations}
            onStatusUpdate={handleStatusUpdate}
            onCreatePlan={handleCreatePlan}
            onGenerateRecommendation={handleGenerateRecommendation}
            isGenerating={generateRecommendation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="implementation" className="space-y-4">
          <ImplementationPlansTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
