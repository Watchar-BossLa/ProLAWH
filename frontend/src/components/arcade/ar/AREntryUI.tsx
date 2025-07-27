
import React from "react";
import { Button } from "@/components/ui/button";
import { Cuboid } from "lucide-react";
import { ARPermissionsRequest } from "./ARPermissionsRequest";

interface AREntryUIProps {
  isRequestingPermission: boolean;
  isInitializing: boolean;
  onRequestPermission: () => Promise<void>;
  onSwitchToFallback: () => void;
  requiredItemsCount: number;
  onSetRequestingPermission: (requesting: boolean) => void;
}

export function AREntryUI({
  isRequestingPermission,
  isInitializing,
  onRequestPermission,
  onSwitchToFallback,
  requiredItemsCount,
  onSetRequestingPermission
}: AREntryUIProps) {
  return (
    <>
      {isRequestingPermission ? (
        <ARPermissionsRequest
          onRequestPermission={onRequestPermission}
          onCancel={onSwitchToFallback}
          isRequesting={isInitializing}
        />
      ) : (
        <div className="text-center py-4">
          <Button 
            onClick={() => onSetRequestingPermission(true)} 
            size="lg"
            className="gap-2"
          >
            <Cuboid className="h-5 w-5" />
            Start AR Challenge
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            You'll need to place {requiredItemsCount} objects in your environment
          </p>
          <Button 
            variant="link" 
            onClick={onSwitchToFallback} 
            className="mt-2 text-sm"
          >
            Unable to use AR? Try simulation mode
          </Button>
        </div>
      )}
    </>
  );
}
