
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Lightbulb, XCircle } from "lucide-react";
import { CareerRecommendation } from "@/hooks/useCareerTwin";

interface ActivityItemProps {
  recommendation: CareerRecommendation;
}

function ActivityItem({ recommendation }: ActivityItemProps) {
  const getStatusIcon = () => {
    switch (recommendation.status) {
      case 'implemented':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'accepted':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDisplayType = () => {
    switch (recommendation.type) {
      case 'skill_gap':
        return 'Skill Development';
      case 'job_match':
        return 'Career Opportunity';
      case 'mentor_suggest':
        return 'Mentorship';
      default:
        return recommendation.type;
    }
  };

  return (
    <div className="flex items-center gap-3 pb-3 border-b last:border-0">
      {getStatusIcon()}
      <div>
        <p className="font-medium text-sm">{getDisplayType()}</p>
        <p className="text-xs text-muted-foreground">
          {recommendation.recommendation.substring(0, 60)}...
        </p>
      </div>
    </div>
  );
}

interface RecentActivityFeedProps {
  recommendations: CareerRecommendation[];
}

export function RecentActivityFeed({ recommendations }: RecentActivityFeedProps) {
  const recentRecommendations = recommendations.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions on your career recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRecommendations.length > 0 ? (
            recentRecommendations.map(rec => (
              <ActivityItem key={rec.id} recommendation={rec} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
