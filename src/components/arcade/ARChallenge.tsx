
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Cube, AlertCircle } from "lucide-react";

interface ARChallengeProps {
  challenge: {
    id: string;
    validation_rules: any;
    points: number;
  };
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

export default function ARChallenge({ challenge, onComplete }: ARChallengeProps) {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [arSession, setARSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [placedObjects, setPlacedObjects] = useState<string[]>([]);
  
  // Check if AR is supported
  useEffect(() => {
    // Using feature detection to check if AR is supported
    if ('xr' in navigator) {
      // @ts-ignore - XR API may not be fully typed
      navigator.xr?.isSessionSupported('immersive-ar')
        .then(supported => {
          setIsARSupported(supported);
        })
        .catch(error => {
          console.error("Error checking AR support:", error);
          setIsARSupported(false);
        });
    } else {
      setIsARSupported(false);
    }
  }, []);

  const startARExperience = async () => {
    if (!isARSupported) return;
    
    setIsInitializing(true);
    try {
      // In a real implementation, this would initialize WebXR
      console.log("Starting AR session");
      
      // Mock AR session for the demo
      const mockSession = {
        id: "ar-session-" + Math.random().toString(36).substr(2, 9),
        active: true
      };
      
      setARSession(mockSession);
      setIsInitializing(false);
    } catch (error) {
      console.error("Error starting AR session:", error);
      setIsInitializing(false);
    }
  };

  const placeMockObject = (objectType: string) => {
    // In a real implementation, this would place a 3D object in the AR scene
    console.log(`Placing ${objectType} in AR space`);
    setPlacedObjects(prev => [...prev, objectType]);
    
    // Check if the required objects have been placed
    const requiredItems = challenge.validation_rules.required_items || [];
    const allPlaced = requiredItems.every(item => 
      placedObjects.includes(item) || item === objectType
    );
    
    if (allPlaced) {
      // Challenge completed successfully
      onComplete(true, { 
        placed_objects: [...placedObjects, objectType],
        completion_time: new Date().toISOString()
      }, challenge.points);
    }
  };

  const exitAR = () => {
    if (arSession) {
      console.log("Exiting AR session");
      setARSession(null);
    }
  };

  if (isARSupported === null) {
    return (
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Cube className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <p className="text-center">Checking AR capabilities...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isARSupported === false) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AR Not Supported</AlertTitle>
        <AlertDescription>
          Your device or browser doesn't support AR experiences. Please try on an AR-capable device.
        </AlertDescription>
      </Alert>
    );
  }

  if (!arSession) {
    return (
      <div className="py-6 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Cube className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">AR Challenge</h3>
            </div>
            <p className="text-center mb-6">
              Place virtual objects in your environment to complete this challenge.
              You'll need to place {(challenge.validation_rules.required_items || []).length} objects correctly.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={startARExperience} 
                disabled={isInitializing}
                className="w-full sm:w-auto"
              >
                {isInitializing ? "Initializing AR..." : "Launch AR Experience"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock AR interface once session is active
  return (
    <div className="py-6 space-y-4">
      <Alert>
        <Cube className="h-4 w-4" />
        <AlertTitle>AR Session Active</AlertTitle>
        <AlertDescription>
          Place the required objects in your environment. For this prototype, buttons below 
          simulate placing objects in AR space.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-2 gap-3">
        {(challenge.validation_rules.required_items || []).map((item: string) => (
          <Button
            key={item}
            onClick={() => placeMockObject(item)}
            variant={placedObjects.includes(item) ? "outline" : "default"}
            className={`${placedObjects.includes(item) ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}`}
          >
            {placedObjects.includes(item) ? `✓ Place ${item}` : `Place ${item}`}
          </Button>
        ))}
      </div>
      
      <div className="pt-4">
        <Button variant="secondary" onClick={exitAR} className="w-full">
          Exit AR Mode
        </Button>
      </div>
    </div>
  );
}
