
import React from 'react';
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CareerTwinCard } from "@/components/career/CareerTwinCard";
import { CareerRecommendation } from "@/types/career";

interface CareerTwinContentProps {
  isUserLoggedIn: boolean;
  isLoading: boolean;
  recommendations: CareerRecommendation[];
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onImplement: (id: string) => Promise<void>;
}

export const CareerTwinContent: React.FC<CareerTwinContentProps> = ({
  isUserLoggedIn,
  isLoading,
  recommendations,
  onStatusUpdate,
  onImplement
}) => {
  if (!isUserLoggedIn) {
    return (
      <Alert>
        <AlertTitle>Sign in required</AlertTitle>
        <AlertDescription>
          Please sign in to use the AI Career Twin feature.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg border">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
        <p className="text-muted-foreground">
          Click the "Generate New Insight" button to receive personalized career recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-50 duration-500">
      {recommendations.map((recommendation) => (
        <CareerTwinCard
          key={recommendation.id}
          recommendation={recommendation}
          onStatusUpdate={onStatusUpdate}
          onImplement={onImplement}
        />
      ))}
    </div>
  );
};
