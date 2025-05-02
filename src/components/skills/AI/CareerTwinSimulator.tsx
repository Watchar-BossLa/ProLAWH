import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCareerTwin } from "@/hooks/useCareeriTwin";
import { useNavigate } from 'react-router-dom';
import { CareerRecommendation } from '@/types/career';

interface CareerTwinSimulatorProps {
  userSkills: string[];
}

export function CareerTwinSimulator({ userSkills }: CareerTwinSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const { addRecommendation, getRecommendations } = useCareerTwin();
  const navigate = useNavigate();
  
  const handleSimulate = async () => {
    setOpenDialog(true);
    setIsSimulating(true);
    setSimulationProgress(0);
    setCurrentStage('Analyzing your skill profile...');
    
    // Simulate AI analysis with progress updates
    await simulateProgress(25, 'Analyzing your skill profile...');
    await simulateProgress(50, 'Matching with market opportunities...');
    await simulateProgress(75, 'Generating career transition paths...');
    await simulateProgress(100, 'Creating skill development plan...');
    
    try {
      await addRecommendation();
      const fetchedRecommendations = await getRecommendations();
      if (fetchedRecommendations) {
        setRecommendations(fetchedRecommendations);
      }
      setIsSimulating(false);
    } catch (error) {
      console.error('Failed to generate career recommendation:', error);
      setIsSimulating(false);
    }
  };

  const goToCareerTwin = () => {
    setOpenDialog(false);
    navigate('/dashboard/career-twin');
  };
  
  const simulateProgress = async (progress: number, stage: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSimulationProgress(progress);
        setCurrentStage(stage);
        resolve();
      }, 1000);
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Career Twin Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The Career Twin Simulator uses AI to map your current skills to potential green economy career paths, 
            providing personalized recommendations and skill transition guidance.
          </p>
          
          <div className="space-y-4 mb-4">
            <div>
              <div className="text-sm font-medium mb-1">Your Current Skills</div>
              <div className="flex flex-wrap gap-1">
                {userSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleSimulate}
              className="flex items-center gap-2"
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Simulating Career Paths
                </>
              ) : (
                <>
                  Generate Career Twin
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Career Twin Analysis</DialogTitle>
            <DialogDescription>
              {isSimulating 
                ? "AI is analyzing your skills and generating personalized career pathways." 
                : "Analysis complete! Here are your career transition opportunities."
              }
            </DialogDescription>
          </DialogHeader>
          
          {isSimulating ? (
            <div className="py-6 space-y-4">
              <Progress value={simulationProgress} className="h-2" />
              <div className="text-center text-sm">{currentStage}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations?.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="font-medium">{recommendation.type === 'job_match' ? 'Career Match' : 'Skill Development'}</div>
                  <p className="text-sm text-muted-foreground">{recommendation.recommendation}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">
                      {Math.round(recommendation.relevance_score * 100)}% Match
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={goToCareerTwin}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {(!recommendations || recommendations.length === 0) && (
                <div className="text-center py-6 text-muted-foreground">
                  No recommendations available yet. Please try again.
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={goToCareerTwin}
              disabled={isSimulating}
            >
              {isSimulating ? 'Please wait...' : 'View All Insights'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
