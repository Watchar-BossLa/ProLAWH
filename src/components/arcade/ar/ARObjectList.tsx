
import React from "react";
import { cn } from "@/lib/utils";

interface ARObjectListProps {
  requiredItems: string[];
  placedObjects: string[];
  className?: string;
}

export function ARObjectList({ 
  requiredItems, 
  placedObjects,
  className 
}: ARObjectListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium">Objects to Place:</h4>
      <div className="grid grid-cols-2 gap-2">
        {requiredItems.map((item) => {
          const isPlaced = placedObjects.includes(item);
          return (
            <div 
              key={item} 
              className={cn(
                "px-3 py-2 rounded-md text-sm border flex items-center gap-2",
                isPlaced 
                  ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" 
                  : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300"
              )}
            >
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                isPlaced 
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300" 
                  : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              )}>
                {isPlaced ? "✓" : "○"}
              </span>
              <span className="capitalize">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
