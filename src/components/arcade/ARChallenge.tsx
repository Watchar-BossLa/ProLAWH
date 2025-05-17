
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cuboid, CircleArrowDown } from "lucide-react";
import ARSessionManager from "./ar/ARSessionManager";
import ARErrorBoundary from "./ar/ARErrorBoundary";
import ARFallbackMode from "./ar/ARFallbackMode";

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
  
  // Get required items from challenge validation rules
  const requiredItems = challenge.validation_rules.required_items || [];

  const handleObjectPlaced = (objectType: string) => {
    if (!placedObjects.includes(objectType)) {
      setPlacedObjects(prev => [...prev, objectType]);
    }
  };

  return (
    <div className="py-6 space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Cuboid className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">AR Challenge</h3>
          </div>
          
          <Alert className="mb-6">
            <CircleArrowDown className="h-4 w-4" />
            <AlertTitle>AR Instructions</AlertTitle>
            <AlertDescription>
              Place all required objects in your environment to complete this AR challenge. 
              You'll need to grant camera permissions to use AR features.
            </AlertDescription>
          </Alert>

          <ARErrorBoundary fallback={
            <ARFallbackMode 
              requiredItems={requiredItems} 
              onComplete={onComplete}
              points={challenge.points} 
            />
          }>
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
