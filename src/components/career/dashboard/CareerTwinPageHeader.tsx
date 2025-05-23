
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";

interface CareerTwinPageHeaderProps {
  onGenerateRecommendation: () => Promise<void>;
  isGenerating: boolean;
}

export function CareerTwinPageHeader({ onGenerateRecommendation, isGenerating }: CareerTwinPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Career Twin</h1>
        <p className="text-muted-foreground">
          Your personalized AI assistant for career guidance, skill development, 
          and professional growth in the green economy.
        </p>
      </div>
      
      <Button 
        onClick={onGenerateRecommendation}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Brain className="h-4 w-4 mr-2" />
        )}
        Generate New Recommendation
      </Button>
    </div>
  );
}
