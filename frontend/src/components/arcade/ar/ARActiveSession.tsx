
import React from "react";
import { XR } from "@react-three/xr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import ARScene from "./ARScene";
import { ARObjectList } from "./ARObjectList";

interface ARActiveSessionProps {
  requiredItems: string[];
  placedObjects: string[];
  onPlaceObject: (objectType: string) => void;
  onExitSession: () => void;
}

export function ARActiveSession({
  requiredItems,
  placedObjects,
  onPlaceObject,
  onExitSession
}: ARActiveSessionProps) {
  return (
    <>
      <Card>
        <CardContent className="p-0 overflow-hidden relative">
          <div className="w-full h-[400px] relative">
            <XR>
              <ARScene 
                requiredItems={requiredItems}
                onPlaceObject={onPlaceObject}
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
        
        <Button variant="outline" onClick={onExitSession} className="gap-2 ml-4">
          <Square className="h-4 w-4" />
          Exit AR Mode
        </Button>
      </div>
    </>
  );
}
