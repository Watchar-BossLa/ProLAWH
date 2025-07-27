
import { Card } from "@/components/ui/card";
import { useCareerTwin } from "@/hooks/useCareerTwin";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock9 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerTwinRecommendationSummaryProps {
  className?: string;
}

export function CareerTwinRecommendationSummary({ className }: CareerTwinRecommendationSummaryProps) {
  const { recommendations, isLoading } = useCareerTwin();
  
  if (isLoading || !recommendations || recommendations.length === 0) {
    return null;
  }
  
  // Get accepted and pending recommendations
  const acceptedRecommendations = recommendations.filter(rec => 
    rec.status === "accepted" || rec.status === "implemented"
  );
  
  const pendingRecommendations = recommendations.filter(rec => 
    rec.status === "pending"
  );
  
  // Get recommendations by type
  const skillGapRecs = recommendations.filter(rec => rec.type === "skill_gap").length;
  const jobMatchRecs = recommendations.filter(rec => rec.type === "job_match").length;
  const mentorRecs = recommendations.filter(rec => rec.type === "mentor_suggest").length;
  
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-medium">AI Career Twin Summary</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 flex gap-1 items-center">
            <span className="bg-blue-500/20 p-1 rounded-full flex items-center justify-center h-4 w-4">
              <span className="text-xs">{skillGapRecs}</span>
            </span>
            <span>Skill Gaps</span>
          </Badge>
          
          <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 flex gap-1 items-center">
            <span className="bg-emerald-500/20 p-1 rounded-full flex items-center justify-center h-4 w-4">
              <span className="text-xs">{jobMatchRecs}</span>
            </span>
            <span>Job Matches</span>
          </Badge>
          
          <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 flex gap-1 items-center">
            <span className="bg-purple-500/20 p-1 rounded-full flex items-center justify-center h-4 w-4">
              <span className="text-xs">{mentorRecs}</span>
            </span>
            <span>Mentorships</span>
          </Badge>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex flex-col sm:flex-row text-sm">
        <div className="flex items-center gap-1.5 sm:pr-4">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{acceptedRecommendations.length} recommendations accepted</span>
        </div>
        
        {pendingRecommendations.length > 0 && (
          <>
            <Separator orientation="vertical" className="hidden sm:block h-6 mx-4" />
            <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
              <Clock9 className="h-4 w-4 text-amber-500" />
              <span>{pendingRecommendations.length} pending insights to review</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
