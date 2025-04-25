
import { BadgeCheck, Lightbulb, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
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
      // Two-step type assertion pattern for better type safety
      const { error } = await supabase
        .from('career_recommendations' as unknown as any)
        .update({ status })
        .eq('id', recommendation.id);

      if (error) throw error;
      onStatusUpdate(recommendation.id, status);
      
      // Track user engagement with recommendations
      await supabase
        .from('user_activity_logs' as unknown as any)
        .insert({
          activity_type: 'career_recommendation_status_change',
          metadata: { 
            recommendation_id: recommendation.id,
            new_status: status
          }
        }).catch(err => console.error("Failed to log activity:", err));
      
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

  // Determine status icon
  const StatusIcon = () => {
    switch (recommendation.status) {
      case 'accepted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'implemented':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={recommendation.status === 'rejected' ? "opacity-70" : ""}>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {recommendation.type === 'skill_gap' && <BookOpen className="h-5 w-5" />}
            {recommendation.type === 'job_match' && <Lightbulb className="h-5 w-5" />}
            {recommendation.type === 'mentor_suggest' && <BadgeCheck className="h-5 w-5" />}
            {recommendation.type.replace('_', ' ').charAt(0).toUpperCase() + recommendation.type.slice(1).replace('_', ' ')}
          </CardTitle>
          <CardDescription>
            Relevance: {Math.round(recommendation.relevance_score * 100)}%
          </CardDescription>
        </div>
        <StatusIcon />
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
        {recommendation.status === 'rejected' && (
          <Button 
            variant="outline" 
            onClick={() => handleStatusUpdate('pending')}
            disabled={isUpdating}
          >
            Reconsider
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
