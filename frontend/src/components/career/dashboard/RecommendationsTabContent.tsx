
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { RecommendationsList } from "./RecommendationsList";

interface RecommendationsTabContentProps {
  pendingRecommendations: CareerRecommendation[];
  acceptedRecommendations: CareerRecommendation[];
  implementedRecommendations: CareerRecommendation[];
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onCreatePlan: (recommendationId: string, data: { title: string; description: string; steps: string[] }) => Promise<void>;
  onGenerateRecommendation: () => Promise<void>;
  isGenerating: boolean;
}

export function RecommendationsTabContent({
  pendingRecommendations,
  acceptedRecommendations,
  implementedRecommendations,
  onStatusUpdate,
  onCreatePlan,
  onGenerateRecommendation,
  isGenerating
}: RecommendationsTabContentProps) {
  return (
    <>
      {/* Pending Recommendations */}
      <RecommendationsList
        title="Pending Recommendations"
        recommendations={pendingRecommendations}
        onStatusUpdate={onStatusUpdate}
        onCreatePlan={onCreatePlan}
        emptyMessage="No pending recommendations. All recommendations have been reviewed."
      />
      
      {/* Accepted Recommendations */}
      <RecommendationsList
        title="Accepted Recommendations"
        recommendations={acceptedRecommendations}
        onStatusUpdate={onStatusUpdate}
        onCreatePlan={onCreatePlan}
        emptyMessage="No accepted recommendations yet. Review your pending recommendations."
      />
      
      {/* Implemented Recommendations */}
      <RecommendationsList
        title="Implemented Recommendations"
        recommendations={implementedRecommendations}
        onStatusUpdate={onStatusUpdate}
        emptyMessage="No implemented recommendations. Mark recommendations as implemented when completed."
      />
      
      <div className="flex justify-center pt-4">
        <Button 
          onClick={onGenerateRecommendation}
          disabled={isGenerating}
          className="flex items-center"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Generate New Recommendation
        </Button>
      </div>
    </>
  );
}
