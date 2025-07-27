
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Compass } from "lucide-react";

interface ARPermissionsRequestProps {
  onRequestPermission: () => void;
  onCancel: () => void;
  isRequesting?: boolean;
}

export function ARPermissionsRequest({ 
  onRequestPermission, 
  onCancel, 
  isRequesting = false 
}: ARPermissionsRequestProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
          <Compass className="h-8 w-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground mt-1">
            To experience AR challenges, we need permission to use your device's camera.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onRequestPermission}
            disabled={isRequesting} 
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {isRequesting ? "Requesting Access..." : "Allow Camera Access"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="gap-2"
          >
            <EyeOff className="h-4 w-4" />
            Continue Without Camera
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Your camera is only used within your browser for the AR experience.
          No images are stored or transmitted.
        </p>
      </CardContent>
    </Card>
  );
}
