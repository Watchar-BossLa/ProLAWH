
import React from 'react';
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerTwinHeaderProps {
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  isLoading: boolean;
  isUserLoggedIn: boolean;
}

export const CareerTwinHeader: React.FC<CareerTwinHeaderProps> = ({ 
  onGenerate, 
  isGenerating, 
  isLoading, 
  isUserLoggedIn 
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Career Twin</h1>
        </div>
        
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || isLoading || !isUserLoggedIn}
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
    </>
  );
};
