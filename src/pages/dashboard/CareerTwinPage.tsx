
import { useEffect } from "react";
import { useCareerTwin, CareerRecommendation } from "@/hooks/useCareerTwin";
import { CareerTwinRecommendationCard } from "@/components/career/CareerTwinRecommendationCard";
import { CareerTwinActivityFeed } from "@/components/career/CareerTwinActivityFeed";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Lightbulb, BarChart2, PlusCircle, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pageTransitions } from "@/lib/transitions";
import { CareerTwinInsightsDashboard } from "@/components/career/CareerTwinInsightsDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function CareerTwinPage() {
  const { user } = useAuth();
  const { 
    recommendations, 
    isLoading, 
    error,
    refetch,
    generateRecommendation,
    updateRecommendation,
    createImplementationPlan,
    trackActivity
  } = useCareerTwin();

  useEffect(() => {
    if (user) {
      // Track page view when component mounts
      trackActivity("page_view");
      trackActivity("career_twin_page_viewed");
    }
  }, [user, trackActivity]);

  const handleGenerate = async () => {
    try {
      await generateRecommendation.mutateAsync();
      trackActivity("generate_recommendation");
    } catch (error: any) {
      // Error handling is done in the hook
    }
  };

  const handleStatusUpdate = async (id: string, status: CareerRecommendation["status"]) => {
    try {
      await updateRecommendation.mutateAsync({ id, status });
      trackActivity("update_status", { recommendation_id: id, new_status: status });
    } catch (error: any) {
      // Error handling is done in the hook
    }
  };

  const handleCreatePlan = async (recommendationId: string, data: any) => {
    try {
      await createImplementationPlan.mutateAsync({
        recommendationId,
        title: data.title,
        description: data.description,
        steps: data.steps
      });
      trackActivity("create_plan", { recommendation_id: recommendationId });
    } catch (error: any) {
      // Error handling is done in the hook
    }
  };

  // Group recommendations by type
  const skillGapRecs = recommendations?.filter(r => r.type === 'skill_gap') || [];
  const jobMatchRecs = recommendations?.filter(r => r.type === 'job_match') || [];
  const mentorRecs = recommendations?.filter(r => r.type === 'mentor_suggest') || [];
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Career Twin</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 space-y-8 ${pageTransitions.initial}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Career Twin</h1>
            <p className="text-muted-foreground">
              Personalized career guidance based on your skills and interests
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={generateRecommendation.isPending}
          className="md:w-auto w-full"
        >
          {generateRecommendation.isPending ? (
            <>
              <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate New Insight
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            Skills
            {skillGapRecs.length > 0 && <span className="ml-1 bg-primary/10 text-xs px-1.5 rounded-full">{skillGapRecs.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            Jobs
            {jobMatchRecs.length > 0 && <span className="ml-1 bg-primary/10 text-xs px-1.5 rounded-full">{jobMatchRecs.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="mentors" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Mentors
            {mentorRecs.length > 0 && <span className="ml-1 bg-primary/10 text-xs px-1.5 rounded-full">{mentorRecs.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart2 className="h-4 w-4 mr-1" />
            Dashboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations?.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Click the "Generate New Insight" button to receive personalized career recommendations
                based on your skill profile.
              </p>
              <Button onClick={handleGenerate}>Generate First Insight</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-50 duration-500">
              {recommendations?.map((recommendation) => (
                <CareerTwinRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStatusUpdate={handleStatusUpdate}
                  onCreatePlan={handleCreatePlan}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="grid gap-4 md:grid-cols-2">
            {skillGapRecs.length === 0 ? (
              <div className="text-center py-8 border rounded-lg col-span-2">
                <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">No Skill Recommendations</h3>
                <p className="text-muted-foreground text-sm">
                  Generate new insights to receive skill development recommendations
                </p>
              </div>
            ) : (
              skillGapRecs.map((recommendation) => (
                <CareerTwinRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStatusUpdate={handleStatusUpdate}
                  onCreatePlan={handleCreatePlan}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="grid gap-4 md:grid-cols-2">
            {jobMatchRecs.length === 0 ? (
              <div className="text-center py-8 border rounded-lg col-span-2">
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">No Job Match Recommendations</h3>
                <p className="text-muted-foreground text-sm">
                  Generate new insights to receive job opportunity matches
                </p>
              </div>
            ) : (
              jobMatchRecs.map((recommendation) => (
                <CareerTwinRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStatusUpdate={handleStatusUpdate}
                  onCreatePlan={handleCreatePlan}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mentors">
          <div className="grid gap-4 md:grid-cols-2">
            {mentorRecs.length === 0 ? (
              <div className="text-center py-8 border rounded-lg col-span-2">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">No Mentorship Recommendations</h3>
                <p className="text-muted-foreground text-sm">
                  Generate new insights to receive mentorship suggestions
                </p>
              </div>
            ) : (
              mentorRecs.map((recommendation) => (
                <CareerTwinRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStatusUpdate={handleStatusUpdate}
                  onCreatePlan={handleCreatePlan}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <CareerTwinActivityFeed />
        </TabsContent>
        
        <TabsContent value="insights">
          <CareerTwinInsightsDashboard recommendations={recommendations || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import missing icons
import { Users, Briefcase, GraduationCap } from 'lucide-react';
