
import { TabsContent } from "@/components/ui/tabs";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { CareerTwinInsightsDashboard } from "@/components/career/CareerTwinInsightsDashboard";
import { RecommendationsTabContent } from "./RecommendationsTabContent";
import { ImplementationPlansTab } from "./ImplementationPlansTab";

interface CareerTwinTabContentProps {
  activeTab: string;
  recommendations: CareerRecommendation[];
  pendingRecommendations: CareerRecommendation[];
  acceptedRecommendations: CareerRecommendation[];
  implementedRecommendations: CareerRecommendation[];
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onCreatePlan: (recommendationId: string, data: { title: string; description: string; steps: string[] }) => Promise<void>;
  onGenerateRecommendation: () => Promise<void>;
  isGenerating: boolean;
}

export function CareerTwinTabContent({
  activeTab,
  recommendations,
  pendingRecommendations,
  acceptedRecommendations,
  implementedRecommendations,
  onStatusUpdate,
  onCreatePlan,
  onGenerateRecommendation,
  isGenerating
}: CareerTwinTabContentProps) {
  return (
    <>
      <TabsContent value="recommendations" className="space-y-6">
        <RecommendationsTabContent
          pendingRecommendations={pendingRecommendations}
          acceptedRecommendations={acceptedRecommendations}
          implementedRecommendations={implementedRecommendations}
          onStatusUpdate={onStatusUpdate}
          onCreatePlan={onCreatePlan}
          onGenerateRecommendation={onGenerateRecommendation}
          isGenerating={isGenerating}
        />
      </TabsContent>
      
      <TabsContent value="insights">
        <CareerTwinInsightsDashboard recommendations={recommendations} />
      </TabsContent>
      
      <TabsContent value="plans">
        <ImplementationPlansTab />
      </TabsContent>
    </>
  );
}
