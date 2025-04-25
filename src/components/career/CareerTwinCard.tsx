
import { BadgeCheck, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CareerRecommendation {
  id: string;
  type: string;
  recommendation: string;
  relevance_score: number;
  status: string;
}

interface CareerTwinCardProps {
  recommendation: CareerRecommendation;
  onStatusUpdate: (id: string, status: string) => void;
}

export function CareerTwinCard({ recommendation, onStatusUpdate }: CareerTwinCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: string) => {
    setIsUpdating(true);
    try {
      // Use generic query to avoid TypeScript issues with the table
      const { error } = await supabase
        .from('career_recommendations')
        .update({ status })
        .eq('id', recommendation.id) as { error: any };

      if (error) throw error;
      onStatusUpdate(recommendation.id, status);
      
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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recommendation.type === 'skill_gap' && <BookOpen className="h-5 w-5" />}
          {recommendation.type === 'job_match' && <Lightbulb className="h-5 w-5" />}
          {recommendation.type === 'mentor_suggest' && <BadgeCheck className="h-5 w-5" />}
          {recommendation.type.replace('_', ' ').charAt(0).toUpperCase() + recommendation.type.slice(1).replace('_', ' ')}
        </CardTitle>
        <CardDescription>
          Relevance: {Math.round(recommendation.relevance_score * 100)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{recommendation.recommendation}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        {recommendation.status === 'pending' && (
          <>
            <Button 
              variant="default" 
              onClick={() => handleStatusUpdate('accepted')}
              disabled={isUpdating}
            >
              Accept
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleStatusUpdate('rejected')}
              disabled={isUpdating}
            >
              Dismiss
            </Button>
          </>
        )}
        {recommendation.status === 'accepted' && (
          <Button 
            variant="outline" 
            onClick={() => handleStatusUpdate('implemented')}
            disabled={isUpdating}
          >
            Mark as Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
