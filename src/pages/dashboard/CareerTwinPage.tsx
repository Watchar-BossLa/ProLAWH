
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useCareerTwin, CareerRecommendation } from "@/hooks/useCareeriTwin";
import { CareerTwinCard } from "@/components/career/CareerTwinCard";
import { Brain, Lightbulb, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function CareerTwinPage() {
  const { user } = useAuth();
  const { 
    loading, 
    getRecommendations, 
    updateRecommendationStatus, 
    implementRecommendation,
    addRecommendation
  } = useCareerTwin();

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, typeFilter, statusFilter]);

  const fetchRecommendations = async () => {
    const type = typeFilter !== 'all' ? typeFilter : undefined;
    const status = statusFilter !== 'all' ? statusFilter : undefined;
    
    const data = await getRecommendations(type, status);
    if (data) {
      setRecommendations(data);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    
    try {
      setIsGenerating(true);
      await addRecommendation();
      await fetchRecommendations();
      toast({
        title: "Success",
        description: "New career recommendation generated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: CareerRecommendation["status"]) => {
    try {
      await updateRecommendationStatus(id, status);
      await fetchRecommendations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recommendation status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleImplement = async (id: string) => {
    try {
      await implementRecommendation(id);
      await fetchRecommendations();
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create implementation plan",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Career Twin</h1>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || loading || !user}
        >
          Generate New Insight
        </Button>
      </div>

      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-6">
          Your AI Career Twin analyzes your skills, interests, and market trends to provide
          personalized career guidance and recommendations tailored to the green economy.
        </p>
      </div>

      {!user ? (
        <Alert>
          <AlertTitle>Sign in required</AlertTitle>
          <AlertDescription>
            Please sign in to use the AI Career Twin feature.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Your Recommendations</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Filters:</span>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Recommendation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="skill_gap">Skill Gap</SelectItem>
                    <SelectItem value="job_match">Job Match</SelectItem>
                    <SelectItem value="mentor_suggest">Mentorship</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-lg border">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : recommendations?.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground">
                Click the "Generate New Insight" button to receive personalized career recommendations.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-50 duration-500">
              {recommendations?.map((recommendation) => (
                <CareerTwinCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStatusUpdate={handleStatusUpdate}
                  onImplement={handleImplement}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
