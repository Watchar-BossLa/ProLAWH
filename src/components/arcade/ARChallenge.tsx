
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cuboid, AlertTriangle } from "lucide-react";
import ARSessionManager from "./ar/ARSessionManager";
import ARErrorBoundary from "./ar/ARErrorBoundary";
import ARFallbackMode from "./ar/ARFallbackMode";
import { useToast } from "@/hooks/use-toast";

interface ARChallengeProps {
  challenge: {
    id: string;
    validation_rules: any;
    points: number;
  };
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

export default function ARChallenge({ challenge, onComplete }: ARChallengeProps) {
  const [placedObjects, setPlacedObjects] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Get required items from challenge validation rules
  const requiredItems = challenge.validation_rules.required_items || [];

  const handleObjectPlaced = (objectType: string) => {
    if (!placedObjects.includes(objectType)) {
      setPlacedObjects(prev => [...prev, objectType]);
    }
  };

  const handleError = (error: Error) => {
    console.error("AR challenge error:", error);
    toast({
      title: "AR Experience Error",
      description: "There was a problem with the AR experience. Switching to simulation mode.",
      variant: "destructive",
    });
  };

  return (
    <div className="py-4 space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Cuboid className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">AR Challenge</h3>
          </div>
          
          <Alert className="mb-4" variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Device Requirements</AlertTitle>
            <AlertDescription>
              This challenge uses Augmented Reality features. For best experience, use a device with AR support.
              If AR isn't available, a simulation mode will be provided.
            </AlertDescription>
          </Alert>

          <ARErrorBoundary 
            fallback={
              <ARFallbackMode 
                requiredItems={requiredItems} 
                onComplete={onComplete}
                points={challenge.points} 
              />
            }
            onError={handleError}
            variant="warning"
          >
            <ARSessionManager 
              requiredItems={requiredItems}
              onObjectPlaced={handleObjectPlaced}
              placedObjects={placedObjects}
              onComplete={onComplete}
              challengePoints={challenge.points}
            />
          </ARErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
