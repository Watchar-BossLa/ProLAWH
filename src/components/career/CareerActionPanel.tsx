
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BookOpen, 
  UserSearch, 
  ClipboardList, 
  ArrowRight
} from "lucide-react";
import { CareerRecommendation } from "@/types/career";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface CareerActionPanelProps {
  recommendation: CareerRecommendation;
  onImplement: (id: string) => Promise<void>;
}

export const CareerActionPanel = ({ recommendation, onImplement }: CareerActionPanelProps) => {
  const navigate = useNavigate();
  
  const handleImplement = async () => {
    try {
      await onImplement(recommendation.id);
      toast({
        title: "Implementation started",
        description: "We've created an implementation plan for this recommendation",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to implement recommendation",
        variant: "destructive",
      });
    }
  };

  const navigateToResource = () => {
    switch (recommendation.type) {
      case 'skill_gap':
        navigate('/dashboard/learning');
        break;
      case 'job_match':
        navigate('/dashboard/projects');
        break;
      case 'mentor_suggest':
        navigate('/dashboard/mentorship');
        break;
      default:
        toast({
          title: "Resource not available",
          description: "We're still building this resource",
          variant: "destructive",
        });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Take Action</CardTitle>
        <CardDescription>
          Get started with this recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex justify-start gap-2"
          onClick={handleImplement}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Create Plan</span>
        </Button>
        
        {recommendation.type === 'skill_gap' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex justify-start gap-2"
            onClick={navigateToResource}
          >
            <BookOpen className="h-4 w-4" />
            <span>Find Courses</span>
          </Button>
        )}
        
        {recommendation.type === 'mentor_suggest' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex justify-start gap-2"
            onClick={navigateToResource}
          >
            <UserSearch className="h-4 w-4" />
            <span>Find Mentor</span>
          </Button>
        )}
        
        <Button 
          variant="default" 
          size="sm"
          className="flex gap-1 justify-center items-center sm:col-start-3" 
          onClick={navigateToResource}
        >
          <span>View Resources</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};
