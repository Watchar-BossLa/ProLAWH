
import { Button } from "@/components/ui/button";
import { 
  XCircle, 
  CheckCircle2, 
  Clock, 
  PanelRight
} from "lucide-react";
import { CareerRecommendation } from "@/hooks/useCareerTwin";

interface RecommendationCardActionsProps {
  recommendation: CareerRecommendation;
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => Promise<void>;
  onOpenPlanDialog: () => void;
}

export function RecommendationCardActions({ 
  recommendation, 
  onStatusUpdate,
  onOpenPlanDialog
}: RecommendationCardActionsProps) {
  if (recommendation.status === 'pending') {
    return (
      <div className="grid grid-cols-3 gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={() => onStatusUpdate(recommendation.id, 'rejected')}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={() => onStatusUpdate(recommendation.id, 'accepted')}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Accept
        </Button>
        
        <Button 
          size="sm" 
          variant="default"
          className="w-full"
          onClick={onOpenPlanDialog}
        >
          <PanelRight className="h-4 w-4 mr-1" />
          Plan
        </Button>
      </div>
    );
  }
  
  if (recommendation.status === 'accepted') {
    return (
      <div className="grid grid-cols-3 gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={() => onStatusUpdate(recommendation.id, 'implemented')}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Mark Implemented
        </Button>
        
        <Button 
          size="sm" 
          variant="default"
          className="w-full col-span-2"
          onClick={onOpenPlanDialog}
        >
          <PanelRight className="h-4 w-4 mr-1" />
          Create Implementation Plan
        </Button>
      </div>
    );
  }
  
  if (recommendation.status === 'rejected') {
    return (
      <Button 
        size="sm" 
        variant="outline"
        className="w-full col-span-3"
        onClick={() => onStatusUpdate(recommendation.id, 'pending')}
      >
        <Clock className="h-4 w-4 mr-1" />
        Reconsider
      </Button>
    );
  }
  
  // 'implemented' status
  return (
    <Button 
      size="sm" 
      variant="outline"
      className="w-full col-span-3"
      disabled
    >
      <CheckCircle2 className="h-4 w-4 mr-1" />
      Implemented
    </Button>
  );
}
