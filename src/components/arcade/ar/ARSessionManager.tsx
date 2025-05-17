
import { useState, useEffect } from "react";
import { XR } from "@react-three/xr";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cuboid, View, Square, AlertCircle } from "lucide-react";
import ARScene from "./ARScene";
import ARFallbackMode from "./ARFallbackMode";
import { ARInstructions } from "./ARInstructions";
import { ARStatusBar } from "./ARStatusBar";
import { ARPermissionsRequest } from "./ARPermissionsRequest";
import { ARObjectList } from "./ARObjectList";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const { toast } = useToast();

  // Check if AR is supported
  useEffect(() => {
    async function checkARSupport() {
      if ("xr" in navigator) {
        try {
          // @ts-ignore - XR API may not be fully typed
          const isSupported = await navigator.xr?.isSessionSupported("immersive-ar");
          setIsARSupported(isSupported);
          
          if (isSupported) {
            toast({
              title: "AR Support Detected",
              description: "Your device supports AR experiences",
            });
          } else {
            toast({
              title: "AR Not Supported",
              description: "Your device doesn't support AR. Using simulation mode instead",
              variant: "destructive",
            });
          }
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
  }, [toast]);

  const handleObjectPlacement = (objectType: string) => {
    // Add object to placed objects
    onObjectPlaced(objectType);
    
    // Provide user feedback
    toast({
      title: "Object Placed",
      description: `${objectType} has been successfully placed!`,
    });
    
    // Check if all required objects are placed
    const newPlacedObjects = [...placedObjects, objectType];
    const allPlaced = requiredItems.every(item => 
      newPlacedObjects.includes(item)
    );
    
    if (allPlaced) {
      // Challenge completed successfully
      toast({
        title: "Challenge Complete!",
        description: `Congratulations! You earned ${challengePoints} points.`,
        variant: "default",
      });
      
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
    setIsRequestingPermission(true);
    
    try {
      // Simulate permission request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSessionActive(true);
      setIsInitializing(false);
      setIsRequestingPermission(false);
      
      toast({
        title: "AR Session Started",
        description: "Look around and tap on objects to place them",
      });
    } catch (error) {
      console.error("Error starting AR session:", error);
      setIsInitializing(false);
      setIsRequestingPermission(false);
      setSessionError("Failed to start AR session");
      
      toast({
        title: "AR Session Failed",
        description: "Could not start AR session. Try using simulation mode.",
        variant: "destructive",
      });
    }
  };

  const exitARSession = () => {
    setIsSessionActive(false);
    toast({
      title: "AR Session Ended",
      description: "You've exited AR mode",
    });
  };

  const switchToFallbackMode = () => {
    setUseFallbackMode(true);
    toast({
      title: "Simulation Mode Activated",
      description: "You're now using the simplified simulation mode",
    });
  };

  // Show loading state while checking AR support
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

  // Fallback mode for non-AR devices
  if (useFallbackMode || isARSupported === false) {
    return (
      <div className="space-y-4">
        {isARSupported === false && sessionError && (
          <Alert variant="destructive" className="mb-4">
            <View className="h-4 w-4" />
            <AlertTitle>AR Not Supported</AlertTitle>
            <AlertDescription>
              {sessionError}
            </AlertDescription>
          </Alert>
        )}
        
        <ARInstructions 
          requiredItems={requiredItems} 
          isExpanded={isInstructionsExpanded}
          onToggleExpand={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
        />
        
        <ARStatusBar 
          placedObjects={placedObjects} 
          requiredItems={requiredItems} 
          deviceInfo={{
            isARSupported,
            isSessionActive: false
          }}
        />
        
        <ARFallbackMode 
          requiredItems={requiredItems}
          onComplete={onComplete}
          points={challengePoints}
        />
      </div>
    );
  }

  // Show permission request before starting AR
  if (!isSessionActive) {
    return (
      <div className="space-y-4">
        <ARInstructions 
          requiredItems={requiredItems} 
          isExpanded={isInstructionsExpanded}
          onToggleExpand={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
        />
        
        <ARStatusBar 
          placedObjects={placedObjects} 
          requiredItems={requiredItems}
          deviceInfo={{
            isARSupported,
            isSessionActive
          }}
        />
        
        {isRequestingPermission ? (
          <ARPermissionsRequest
            onRequestPermission={startARSession}
            onCancel={switchToFallbackMode}
            isRequesting={isInitializing}
          />
        ) : (
          <div className="text-center py-4">
            <Button 
              onClick={() => setIsRequestingPermission(true)} 
              size="lg"
              className="gap-2"
            >
              <Cuboid className="h-5 w-5" />
              Start AR Challenge
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              You'll need to place {requiredItems.length} objects in your environment
            </p>
            <Button 
              variant="link" 
              onClick={switchToFallbackMode} 
              className="mt-2 text-sm"
            >
              Unable to use AR? Try simulation mode
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Active AR session
  return (
    <div className="space-y-4">
      <ARStatusBar 
        placedObjects={placedObjects} 
        requiredItems={requiredItems}
        deviceInfo={{
          isARSupported,
          isSessionActive
        }}
      />
      
      <Card>
        <CardContent className="p-0 overflow-hidden relative">
          <div className="w-full h-[400px] relative">
            <XR>
              <ARScene 
                requiredItems={requiredItems}
                onPlaceObject={handleObjectPlacement}
                placedObjects={placedObjects}
              />
            </XR>
          </div>
          
          {/* AR Session overlay instruction */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="bg-black/60 py-2 px-4 rounded-full mx-auto inline-block text-white text-sm">
              Tap on objects to place them
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <ARObjectList 
          requiredItems={requiredItems} 
          placedObjects={placedObjects}
          className="flex-1"
        />
        
        <Button variant="outline" onClick={exitARSession} className="gap-2 ml-4">
          <Square className="h-4 w-4" />
          Exit AR Mode
        </Button>
      </div>
    </div>
  );
}
