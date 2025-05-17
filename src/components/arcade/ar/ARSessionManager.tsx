
import { useState, useEffect } from "react";
import { XR } from "@react-three/xr";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cuboid, View, Square } from "lucide-react";
import ARScene from "./ARScene";
import ARFallbackMode from "./ARFallbackMode";

interface ARSessionManagerProps {
  requiredItems: string[];
  onObjectPlaced: (objectType: string) => void;
  placedObjects: string[];
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
  challengePoints: number;
}

export default function ARSessionManager({ 
  requiredItems, 
  onObjectPlaced, 
  placedObjects, 
  onComplete,
  challengePoints
}: ARSessionManagerProps) {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  // Check if AR is supported
  useEffect(() => {
    async function checkARSupport() {
      if ("xr" in navigator) {
        try {
          // @ts-ignore - XR API may not be fully typed
          const isSupported = await navigator.xr?.isSessionSupported("immersive-ar");
          setIsARSupported(isSupported);
        } catch (error) {
          console.error("Error checking AR support:", error);
          setIsARSupported(false);
          setSessionError("Could not verify AR capabilities");
        }
      } else {
        setIsARSupported(false);
        setSessionError("WebXR not available in this browser");
      }
    }

    checkARSupport();
  }, []);

  const handleObjectPlacement = (objectType: string) => {
    // Add object to placed objects
    onObjectPlaced(objectType);
    
    // Check if all required objects are placed
    const newPlacedObjects = [...placedObjects, objectType];
    const allPlaced = requiredItems.every(item => 
      newPlacedObjects.includes(item)
    );
    
    if (allPlaced) {
      // Challenge completed successfully
      onComplete(true, { 
        placed_objects: newPlacedObjects,
        completion_time: new Date().toISOString(),
        mode: "ar"
      }, challengePoints);
    }
  };

  const startARSession = async () => {
    if (!isARSupported) return;
    
    setIsInitializing(true);
    try {
      setIsSessionActive(true);
      setIsInitializing(false);
    } catch (error) {
      console.error("Error starting AR session:", error);
      setIsInitializing(false);
      setSessionError("Failed to start AR session");
    }
  };

  const exitARSession = () => {
    setIsSessionActive(false);
  };

  const switchToFallbackMode = () => {
    setUseFallbackMode(true);
  };

  if (isARSupported === null) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <Cuboid className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
          <p>Checking AR capabilities...</p>
        </div>
      </div>
    );
  }

  if (useFallbackMode || isARSupported === false) {
    return (
      <div className="space-y-4">
        {isARSupported === false && (
          <Alert variant="destructive" className="mb-4">
            <View className="h-4 w-4" />
            <AlertTitle>AR Not Supported</AlertTitle>
            <AlertDescription>
              {sessionError || "Your device or browser doesn't support AR experiences."}
            </AlertDescription>
          </Alert>
        )}
        
        <ARFallbackMode 
          requiredItems={requiredItems}
          onComplete={onComplete}
          points={challengePoints}
        />
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      {!isSessionActive ? (
        <div className="text-center">
          <Button 
            onClick={startARSession} 
            disabled={isInitializing}
            size="lg"
            className="gap-2"
          >
            <Cuboid className="h-5 w-5" />
            {isInitializing ? "Initializing AR..." : "Enter AR Mode"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            You'll need to place {requiredItems.length} objects in your environment
          </p>
          <Button 
            variant="link" 
            onClick={switchToFallbackMode} 
            className="mt-4 text-sm"
          >
            Unable to use AR? Try simulation mode
          </Button>
        </div>
      ) : (
        <div>
          <XR>
            <ARScene 
              requiredItems={requiredItems}
              onPlaceObject={handleObjectPlacement}
              placedObjects={placedObjects}
            />
          </XR>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={exitARSession} className="gap-2">
              <Square className="h-4 w-4" />
              Exit AR Mode
            </Button>
          </div>
        </div>
      )}

      {/* Show placed objects list */}
      {placedObjects.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Placed Objects:</h4>
          <div className="flex flex-wrap gap-2">
            {placedObjects.map((object) => (
              <div 
                key={object} 
                className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-sm"
              >
                {object} ✓
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
