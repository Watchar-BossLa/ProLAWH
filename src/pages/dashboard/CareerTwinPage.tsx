
import { useEffect } from "react";
import { useCareerRecommendations, CareerRecommendation } from "@/hooks/useCareerRecommendations";
import { CareerTwinCard } from "@/components/career/CareerTwinCard";
import { Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function CareerTwinPage() {
  const { 
    recommendations, 
    isLoading, 
    updateRecommendation, 
    generateNewRecommendation 
  } = useCareerRecommendations();

  const handleGenerate = async () => {
    try {
      await generateNewRecommendation.mutateAsync();
      toast({
        title: "Success",
        description: "New career recommendation generated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: CareerRecommendation["status"]) => {
    try {
      await updateRecommendation.mutateAsync({ id, status });
      toast({
        title: "Status updated",
        description: `Recommendation marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Career Twin</h1>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={generateNewRecommendation.isPending}
        >
          Generate New Insight
        </Button>
      </div>

      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-6">
          Your AI Career Twin analyzes your skills, interests, and market trends to provide
          personalized career guidance and recommendations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg border">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : recommendations?.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground">
            Click the "Generate New Insight" button to receive personalized career recommendations.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-50 duration-500">
          {recommendations?.map((recommendation) => (
            <CareerTwinCard
              key={recommendation.id}
              recommendation={recommendation}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
