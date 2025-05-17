
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { View } from "lucide-react";
import ARFallbackMode from "./ARFallbackMode";
import { ARInstructions } from "./ARInstructions";
import { ARStatusBar } from "./ARStatusBar";

interface ARFallbackWithNotificationProps {
  isARSupported: boolean;
  sessionError: string | null;
  isInstructionsExpanded: boolean;
  onToggleInstructions: () => void;
  placedObjects: string[];
  requiredItems: string[];
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
  challengePoints: number;
}

export function ARFallbackWithNotification({
  isARSupported,
  sessionError,
  isInstructionsExpanded,
  onToggleInstructions,
  placedObjects,
  requiredItems,
  onComplete,
  challengePoints
}: ARFallbackWithNotificationProps) {
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
        onToggleExpand={onToggleInstructions}
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
