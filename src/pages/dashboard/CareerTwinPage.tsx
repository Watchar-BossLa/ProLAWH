import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, RefreshCw, ChevronRight } from "lucide-react";
import { CareerTwinRecommendationCard } from "@/components/career/CareerTwinRecommendationCard";
import { useCareerTwin } from "@/hooks/useCareerTwin";
import { toast } from "sonner";

export default function CareerTwinPage() {
  const [activeTab, setActiveTab] = useState("insights");
  const { 
    recommendations, 
    isLoading, 
    generateRecommendation, 
    updateRecommendation,
    createImplementationPlan,
    trackActivity
  } = useCareerTwin();
  
  // Filter recommendations by status
  const pendingRecommendations = recommendations?.filter(rec => rec.status === 'pending') || [];
  const acceptedRecommendations = recommendations?.filter(rec => rec.status === 'accepted') || [];
  const implementedRecommendations = recommendations?.filter(rec => rec.status === 'implemented') || [];
  
  const handleStatusUpdate = async (id: string, status: "pending" | "accepted" | "rejected" | "implemented") => {
    try {
      await updateRecommendation.mutateAsync({ id, status });
      trackActivity('status_update', { recommendation_id: id, new_status: status });
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };
  
  const handleCreatePlan = async (
    recommendationId: string, 
    data: { title: string; description: string; steps: string[] }
  ) => {
    try {
      await createImplementationPlan.mutateAsync({
        recommendationId,
        title: data.title,
        description: data.description,
        steps: data.steps
      });
      trackActivity('implementation_plan_created', { recommendation_id: recommendationId });
    } catch (error) {
      console.error('Failed to create implementation plan:', error);
    }
  };
  
  const handleGenerateRecommendation = async () => {
    try {
      await generateRecommendation.mutateAsync();
      toast.success("New career recommendation generated!");
      trackActivity('manual_generation');
    } catch (error) {
      toast.error("Failed to generate recommendation. Please try again.");
      console.error('Failed to generate recommendation:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Career Twin</h1>
          <p className="text-muted-foreground">
            Your personalized AI assistant for career guidance, skill development, 
            and professional growth in the green economy.
          </p>
        </div>
        
        <Button 
          onClick={handleGenerateRecommendation}
          disabled={generateRecommendation.isPending}
        >
          {generateRecommendation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          Generate New Recommendation
        </Button>
      </div>
      
      <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations ({recommendations?.length || 0})</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Identify missing skills for your career advancement
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your current skills against in-demand market requirements, 
                  identifying gaps and recommending personalized learning paths.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
                  View Analysis
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Job Match Finder</CardTitle>
                <CardDescription>
                  Discover green economy roles aligned with your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  Find career opportunities in sustainable industries that match your 
                  skills, experience, and personal interests.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
                  Explore Matches
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Mentorship Suggestions</CardTitle>
                <CardDescription>
                  Connect with experts aligned to your career goals
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  Get recommendations for mentors with expertise in your target sectors,
                  helping accelerate your professional development.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
                  Find Mentors
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Career Insights</CardTitle>
              <CardDescription>
                AI-generated recommendations based on your profile and market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map(recommendation => (
                    <CareerTwinRecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      onStatusUpdate={handleStatusUpdate}
                      onCreatePlan={handleCreatePlan}
                    />
                  ))}
                  
                  {recommendations.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("recommendations")}
                    >
                      View All Recommendations ({recommendations.length})
                    </Button>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No career recommendations found. Generate your first recommendation to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          {/* Pending Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Pending Recommendations</h3>
              <div className="text-sm text-muted-foreground">{pendingRecommendations.length} items</div>
            </div>
            
            {pendingRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRecommendations.map(recommendation => (
                  <CareerTwinRecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={handleStatusUpdate}
                    onCreatePlan={handleCreatePlan}
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No pending recommendations. All recommendations have been reviewed.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Accepted Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Accepted Recommendations</h3>
              <div className="text-sm text-muted-foreground">{acceptedRecommendations.length} items</div>
            </div>
            
            {acceptedRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedRecommendations.map(recommendation => (
                  <CareerTwinRecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={handleStatusUpdate}
                    onCreatePlan={handleCreatePlan}
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No accepted recommendations yet. Review your pending recommendations.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Implemented Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Implemented Recommendations</h3>
              <div className="text-sm text-muted-foreground">{implementedRecommendations.length} items</div>
            </div>
            
            {implementedRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {implementedRecommendations.map(recommendation => (
                  <CareerTwinRecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No implemented recommendations. Mark recommendations as implemented when completed.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleGenerateRecommendation}
              disabled={generateRecommendation.isPending}
              className="flex items-center"
            >
              {generateRecommendation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate New Recommendation
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Plans</CardTitle>
              <CardDescription>
                Track and manage your career development action plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Implementation plans feature coming soon. Create implementation plans from your recommendations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
