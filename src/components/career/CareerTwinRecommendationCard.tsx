
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { RecommendationStatusBadge } from "./recommendation/RecommendationStatusBadge";
import { RecommendationTypeIcon, getRecommendationTitle } from "./recommendation/RecommendationTypeIcon";
import { RecommendationCardActions } from "./recommendation/RecommendationCardActions";
import { PlanCreationDialog } from "./recommendation/PlanCreationDialog";
import { RecommendationDetails } from "./recommendation/RecommendationDetails";

interface CareerTwinRecommendationCardProps {
  recommendation: CareerRecommendation;
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onCreatePlan?: (recommendationId: string, data: { title: string; description: string; steps: string[] }) => Promise<void>;
}

export function CareerTwinRecommendationCard({ 
  recommendation, 
  onStatusUpdate,
  onCreatePlan
}: CareerTwinRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  
  const handleCreatePlan = (data: { title: string; description: string; steps: string[] }) => {
    if (onCreatePlan) {
      onCreatePlan(recommendation.id, data);
      onStatusUpdate(recommendation.id, 'accepted');
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 relative flex flex-row items-start justify-between">
          <div className="flex items-center space-x-2">
            <RecommendationTypeIcon type={recommendation.type} />
            <CardTitle className="text-lg">{getRecommendationTitle(recommendation.type)}</CardTitle>
          </div>
          <RecommendationStatusBadge status={recommendation.status} />
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground mb-2">
            {recommendation.recommendation}
          </p>
          
          <RecommendationDetails 
            recommendation={recommendation}
            expanded={expanded}
          />
        </CardContent>
        
        <CardFooter className="pt-0 flex-col items-stretch gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More
              </>
            )}
          </Button>

          <RecommendationCardActions
            recommendation={recommendation}
            onStatusUpdate={onStatusUpdate}
            onOpenPlanDialog={() => setPlanDialogOpen(true)}
          />
        </CardFooter>
      </Card>
      
      <PlanCreationDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        defaultTitle={`Implementation plan for ${recommendation.type === 'skill_gap' ? 'skill development' : 'career growth'}`}
        onCreatePlan={handleCreatePlan}
      />
    </>
  );
}
