
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { CareerTwinRecommendationCard } from "@/components/career/CareerTwinRecommendationCard";

interface RecentCareerInsightsProps {
  isLoading: boolean;
  recommendations: CareerRecommendation[] | undefined;
  setActiveTab: (tab: string) => void;
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onCreatePlan?: (recommendationId: string, data: { title: string; description: string; steps: string[] }) => Promise<void>;
}

export function RecentCareerInsights({ 
  isLoading, 
  recommendations, 
  setActiveTab,
  onStatusUpdate,
  onCreatePlan
}: RecentCareerInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Career Insights</CardTitle>
        <CardDescription>
          AI-generated recommendations based on your profile and market trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map(recommendation => (
              <CareerTwinRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onStatusUpdate={onStatusUpdate}
                onCreatePlan={onCreatePlan}
              />
            ))}
            
            {recommendations.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab("recommendations")}
              >
                View All Recommendations ({recommendations.length})
              </Button>
            )}
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              No career recommendations found. Generate your first recommendation to get started.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
