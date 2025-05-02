
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart, 
  Briefcase, 
  GraduationCap,
  ChevronDown, 
  ChevronUp,
  PanelRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CareerRecommendation } from "@/hooks/useCareerTwin";

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
  const [planTitle, setPlanTitle] = useState(`Implementation plan for ${recommendation.type === 'skill_gap' ? 'skill development' : 'career growth'}`);
  const [planDescription, setPlanDescription] = useState("");
  const [planSteps, setPlanSteps] = useState<string[]>(["", "", ""]);
  
  const getIcon = () => {
    switch(recommendation.type) {
      case 'skill_gap':
        return <GraduationCap className="h-5 w-5 text-emerald-500" />;
      case 'job_match':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'mentor_suggest':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      default:
        return <BarChart className="h-5 w-5 text-violet-500" />;
    }
  };
  
  const getTitle = () => {
    switch(recommendation.type) {
      case 'skill_gap':
        return "Skill Development";
      case 'job_match':
        return "Career Opportunity";
      case 'mentor_suggest':
        return "Mentorship Suggestion";
      default:
        return "AI Recommendation";
    }
  };

  const getStatusBadge = () => {
    switch(recommendation.status) {
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Rejected</Badge>;
      case 'implemented':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Implemented</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
    }
  };

  const handleCreatePlan = () => {
    if (onCreatePlan) {
      const filteredSteps = planSteps.filter(step => step.trim().length > 0);
      onCreatePlan(recommendation.id, {
        title: planTitle,
        description: planDescription,
        steps: filteredSteps,
      });
      setPlanDialogOpen(false);
      onStatusUpdate(recommendation.id, 'accepted');
    }
  };
  
  const addPlanStep = () => {
    setPlanSteps([...planSteps, ""]);
  };
  
  const updatePlanStep = (index: number, value: string) => {
    const newSteps = [...planSteps];
    newSteps[index] = value;
    setPlanSteps(newSteps);
  };

  const removePlanStep = (index: number) => {
    setPlanSteps(planSteps.filter((_, i) => i !== index));
  };
  
  const relevancePercentage = Math.round(recommendation.relevance_score * 100);
  const formattedDate = new Date(recommendation.created_at).toLocaleDateString();
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 relative flex flex-row items-start justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{getTitle()}</CardTitle>
          </div>
          {getStatusBadge()}
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground mb-2">
            {recommendation.recommendation}
          </p>
          
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

          <div className="grid grid-cols-3 gap-2">
            {recommendation.status === 'pending' && (
              <>
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
                  onClick={() => setPlanDialogOpen(true)}
                >
                  <PanelRight className="h-4 w-4 mr-1" />
                  Plan
                </Button>
              </>
            )}
            
            {recommendation.status === 'accepted' && (
              <>
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
                  onClick={() => setPlanDialogOpen(true)}
                >
                  <PanelRight className="h-4 w-4 mr-1" />
                  Create Implementation Plan
                </Button>
              </>
            )}
            
            {recommendation.status === 'rejected' && (
              <Button 
                size="sm" 
                variant="outline"
                className="w-full col-span-3"
                onClick={() => onStatusUpdate(recommendation.id, 'pending')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Reconsider
              </Button>
            )}
            
            {recommendation.status === 'implemented' && (
              <Button 
                size="sm" 
                variant="outline"
                className="w-full col-span-3"
                disabled
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Implemented
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Implementation Plan</DialogTitle>
            <DialogDescription>
              Create a step-by-step plan to implement this career recommendation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Plan Title</Label>
              <Input 
                id="title" 
                value={planTitle} 
                onChange={(e) => setPlanTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={planDescription} 
                onChange={(e) => setPlanDescription(e.target.value)} 
                placeholder="Describe your implementation plan..."
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Steps to Take</Label>
              {planSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updatePlanStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  {planSteps.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removePlanStep(index)}
                      className="shrink-0"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addPlanStep} 
                className="w-full mt-2"
              >
                Add Step
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
