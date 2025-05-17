
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Compass, Info, CircleArrowDown, Lightbulb } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface ARInstructionsProps {
  requiredItems: string[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ARInstructions({ 
  requiredItems, 
  isExpanded = true, 
  onToggleExpand 
}: ARInstructionsProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand} className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AR Challenge Instructions</h3>
        </div>
        {onToggleExpand && (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isExpanded ? "Hide" : "Show"} Instructions
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
      
      <CollapsibleContent>
        <Card className="mt-2 border-dashed">
          <CardContent className="pt-4 space-y-4">
            <Alert>
              <CircleArrowDown className="h-4 w-4" />
              <AlertTitle>Getting Started</AlertTitle>
              <AlertDescription>
                <p>To complete this AR challenge, you'll need to place the following items in your environment:</p>
                <ul className="mt-2 pl-4 list-disc">
                  {requiredItems.map(item => (
                    <li key={item} className="capitalize">{item}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-medium">How to interact:</h4>
              </div>
              <ol className="pl-6 list-decimal text-sm text-muted-foreground">
                <li>Grant camera permissions when prompted</li>
                <li>Look around to find virtual objects</li>
                <li>Tap on each object to place it in your environment</li>
                <li>Place all required objects to complete the challenge</li>
              </ol>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md flex gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-400">
                <span className="font-medium">Tip:</span> Make sure you're in a well-lit area with enough space to move around. If you're having trouble with AR, you can switch to Simulation Mode below.
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
