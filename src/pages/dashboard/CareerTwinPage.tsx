import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CareerTwinCard } from "@/components/career/CareerTwinCard";
import { Brain, Lightbulb, Target } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { pageTransitions } from "@/lib/transitions";

interface CareerRecommendation {
  id: string;
  type: string;
  recommendation: string;
  relevance_score: number;
  status: string;
}

export default function CareerTwinPage() {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['career-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_recommendations')
        .select('*')
        .order('relevance_score', { ascending: false });
      
      if (error) throw error;
      return data as CareerRecommendation[];
    }
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('career_recommendations')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to update status: ${error.message}`);
      }

      // Optimistically update the UI
      const updatedRecommendations = recommendations?.map(rec =>
        rec.id === id ? { ...rec, status } : rec
      );
      // You might want to update the cache here if using react-query

    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-2 mb-8">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Career Twin</h1>
      </div>

      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-6">
          Your AI Career Twin analyzes your skills, interests, and market trends to provide
          personalized career guidance and recommendations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
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
            Complete more activities to receive personalized career recommendations.
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
