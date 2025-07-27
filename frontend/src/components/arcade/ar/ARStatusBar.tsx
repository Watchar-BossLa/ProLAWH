
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Target, AlertCircle } from "lucide-react";

interface ARStatusBarProps {
  placedObjects: string[];
  requiredItems: string[];
  deviceInfo?: {
    isARSupported: boolean | null;
    isSessionActive: boolean;
  };
}

export function ARStatusBar({ 
  placedObjects, 
  requiredItems, 
  deviceInfo 
}: ARStatusBarProps) {
  const progress = requiredItems.length > 0 
    ? (placedObjects.length / requiredItems.length) * 100 
    : 0;
  
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-medium">Challenge Progress</span>
        </div>
        <span className="text-muted-foreground">
          {placedObjects.length}/{requiredItems.length} objects
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {deviceInfo && (
        <div className="flex items-center gap-2 text-xs mt-2">
          {deviceInfo.isARSupported === false && (
            <div className="flex items-center gap-1 text-amber-500">
              <AlertCircle className="h-3 w-3" />
              <span>AR not supported on this device</span>
            </div>
          )}
          {deviceInfo.isARSupported && !deviceInfo.isSessionActive && (
            <div className="text-muted-foreground">
              Ready to start AR session
            </div>
          )}
          {deviceInfo.isSessionActive && (
            <div className="text-green-600 dark:text-green-400">
              AR session active
            </div>
          )}
        </div>
      )}
    </div>
  );
}
