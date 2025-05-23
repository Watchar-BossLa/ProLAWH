
import { Badge } from "@/components/ui/badge";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { cn } from "@/lib/utils";

interface RecommendationDetailsProps {
  recommendation: CareerRecommendation;
  expanded: boolean;
}

export function RecommendationDetails({ recommendation, expanded }: RecommendationDetailsProps) {
  const relevancePercentage = Math.round(recommendation.relevance_score * 100);
  const formattedDate = new Date(recommendation.created_at).toLocaleDateString();
  
  return (
    <div className={cn("space-y-3 mt-4", expanded ? "block" : "hidden")}>
      {recommendation.skills && recommendation.skills.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1">Related Skills</p>
          <div className="flex flex-wrap gap-1">
            {recommendation.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <p className="text-xs font-medium mb-1">Recommendation Details</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Relevance:</span>
            <Badge variant="outline" className="ml-1">{relevancePercentage}%</Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Generated:</span>
            <span className="ml-1">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
