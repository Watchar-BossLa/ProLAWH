
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ARFallbackModeProps {
  requiredItems: string[];
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
  points: number;
}

export default function ARFallbackMode({ requiredItems, onComplete, points }: ARFallbackModeProps) {
  const [placedObjects, setPlacedObjects] = useState<string[]>([]);
  
  const handleObjectPlacement = (objectType: string) => {
    // Add object to placed list if not already there
    if (!placedObjects.includes(objectType)) {
      const updatedPlacedObjects = [...placedObjects, objectType];
      setPlacedObjects(updatedPlacedObjects);
      
      // Check if all required objects are placed
      const allPlaced = requiredItems.every(item => updatedPlacedObjects.includes(item));
      
      if (allPlaced) {
        // Challenge completed successfully
        onComplete(true, { 
          placed_objects: updatedPlacedObjects,
          completion_time: new Date().toISOString(),
          mode: "fallback"
        }, points);
      }
    }
  };
  
  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900 border-dashed">
      <h4 className="font-medium mb-4 text-center">Simulation Mode (AR Unavailable)</h4>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        AR is not available on your device. Use this simplified mode instead.
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {requiredItems.map((item) => (
          <Button
            key={item}
            onClick={() => handleObjectPlacement(item)}
            variant={placedObjects.includes(item) ? "outline" : "default"}
            className={`${placedObjects.includes(item) ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}`}
          >
            {placedObjects.includes(item) ? `✓ Placed ${item}` : `Place ${item}`}
          </Button>
        ))}
      </div>
    </Card>
  );
}
