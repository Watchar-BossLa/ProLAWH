
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { CareerTwinRecommendationCard } from "@/components/career/CareerTwinRecommendationCard";

interface RecommendationsListProps {
  title: string;
  recommendations: CareerRecommendation[];
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onCreatePlan?: (recommendationId: string, data: { title: string; description: string; steps: string[] }) => Promise<void>;
  emptyMessage: string;
}

export function RecommendationsList({
  title,
  recommendations,
  onStatusUpdate,
  onCreatePlan,
  emptyMessage
}: RecommendationsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="text-sm text-muted-foreground">{recommendations.length} items</div>
      </div>
      
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(recommendation => (
            <CareerTwinRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onStatusUpdate={onStatusUpdate}
              onCreatePlan={onCreatePlan}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            {emptyMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
