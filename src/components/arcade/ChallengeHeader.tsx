
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Timer } from "lucide-react";

interface ChallengeHeaderProps {
  title: string;
  description: string | null;
  timeLimit: number;
  instructions: string;
}

export function ChallengeHeader({ 
  title, 
  description, 
  timeLimit, 
  instructions 
}: ChallengeHeaderProps) {
  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      
      <Alert>
        <Timer className="h-4 w-4" />
        <AlertTitle>Time Limit: {timeLimit} seconds</AlertTitle>
        <AlertDescription>
          This challenge has a strict time limit. You'll need to complete it before time runs out.
        </AlertDescription>
      </Alert>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <p>{instructions}</p>
      </div>
    </div>
  );
}
