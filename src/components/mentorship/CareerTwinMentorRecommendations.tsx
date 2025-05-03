
import { useState } from "react";
import { useCareerTwinMentorship } from "@/hooks/useCareerTwinMentorship";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorshipRequestForm } from "@/components/mentorship/MentorshipRequestForm";
import { Brain, UserPlus, Loader2, AlertCircle } from "lucide-react";

export function CareerTwinMentorRecommendations() {
  const { mentorRecommendations, isLoading, error } = useCareerTwinMentorship();
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Career Twin Mentor Recommendations
          </CardTitle>
          <CardDescription>
            Finding mentors that match your career goals...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Career Twin Mentor Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered mentor matching for your career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-destructive">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error loading recommendations. Please try again later.</span>
        </CardContent>
      </Card>
    );
  }
  
  if (!mentorRecommendations || mentorRecommendations.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Career Twin Mentor Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered mentor matching for your career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No mentor recommendations available yet.</p>
          <p className="text-sm">
            Visit the Career Twin page to generate personalized career recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Career Twin Mentor Recommendations
          </CardTitle>
          <CardDescription>
            AI-suggested mentors based on your career goals and skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentorRecommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{rec.mentorName}</h3>
                  <Badge variant="outline">
                    {Math.round(rec.relevanceScore * 100)}% Match
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {rec.matchReason}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {rec.mentorExpertise.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {rec.mentorExpertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{rec.mentorExpertise.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={() => setSelectedMentor({
                    id: rec.mentorId,
                    name: rec.mentorName,
                    expertise: rec.mentorExpertise,
                    recommendationId: rec.recommendationId
                  })}
                  size="sm"
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Request Mentorship
                </Button>
              </div>
            ))}
          </div>
          
          {mentorRecommendations.length > 3 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedMentor && (
        <MentorshipRequestForm
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          mentor={{
            id: selectedMentor.id,
            name: selectedMentor.name,
            expertise: selectedMentor.expertise,
            recommendationId: selectedMentor.recommendationId
          }}
        />
      )}
    </>
  );
}
