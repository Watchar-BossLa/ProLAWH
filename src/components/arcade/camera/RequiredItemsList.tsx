
import { CheckCircle, Circle, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RequiredItemsListProps {
  items: string[];
  detectionResults: Record<string, boolean>;
}

export function RequiredItemsList({ items, detectionResults }: RequiredItemsListProps) {
  const detectedCount = Object.values(detectionResults).filter(Boolean).length;
  
  return (
    <Card className="border border-muted">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Items to Find</span>
          <span className="text-xs font-normal">
            {detectedCount}/{items.length} found
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-1">
        <ul className="space-y-1">
          {items.map((item, index) => {
            const isDetected = detectionResults[item] || false;
            
            return (
              <li
                key={index}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  isDetected ? "bg-green-50 dark:bg-green-950/20" : "bg-transparent"
                )}
              >
                <span className="flex items-center gap-2">
                  {isDetected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "text-sm",
                    isDetected ? "text-green-700 dark:text-green-300" : "text-muted-foreground"
                  )}>
                    {item}
                  </span>
                </span>
                
                {!isDetected && (
                  <Timer className="h-4 w-4 text-muted-foreground" />
                )}
              </li>
            );
          })}
        </ul>
        
        {items.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-2">
            No specific items required - just capture images!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
