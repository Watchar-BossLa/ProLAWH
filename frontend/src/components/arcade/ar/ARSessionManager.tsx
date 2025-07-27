
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useARSupport } from "@/hooks/useARSupport";
import { ARLoadingState } from "./ARLoadingState";
import { ARInstructions } from "./ARInstructions";
import { ARStatusBar } from "./ARStatusBar";
import { AREntryUI } from "./AREntryUI";
import { ARActiveSession } from "./ARActiveSession";
import { ARFallbackWithNotification } from "./ARFallbackWithNotification";

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
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook to check AR support
  const { isARSupported, sessionError } = useARSupport();

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
    return <ARLoadingState />;
  }

  // Fallback mode for non-AR devices
  if (useFallbackMode || isARSupported === false) {
    return (
      <ARFallbackWithNotification 
        isARSupported={isARSupported}
        sessionError={sessionError}
        isInstructionsExpanded={isInstructionsExpanded}
        onToggleInstructions={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
        placedObjects={placedObjects}
        requiredItems={requiredItems}
        onComplete={onComplete}
        challengePoints={challengePoints}
      />
    );
  }

  // Show permission request or entry UI before starting AR
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
        
        <AREntryUI 
          isRequestingPermission={isRequestingPermission}
          isInitializing={isInitializing}
          onRequestPermission={startARSession}
          onSwitchToFallback={switchToFallbackMode}
          requiredItemsCount={requiredItems.length}
          onSetRequestingPermission={setIsRequestingPermission}
        />
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
      
      <ARActiveSession 
        requiredItems={requiredItems}
        placedObjects={placedObjects}
        onPlaceObject={handleObjectPlacement}
        onExitSession={exitARSession}
      />
    </div>
  );
}
