
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GreenSkillIndicatorProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GreenSkillIndicator({ 
  score, 
  showLabel = false, 
  size = "md",
  className 
}: GreenSkillIndicatorProps) {
  // Score ranges from 0-100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  const getColorClass = () => {
    if (normalizedScore >= 75) return "text-green-500";
    if (normalizedScore >= 50) return "text-lime-500";
    if (normalizedScore >= 25) return "text-amber-500";
    return "text-red-500";
  };
  
  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case "sm": return "h-3 w-3";
      case "lg": return "h-6 w-6";
      default: return "h-4 w-4";
    }
  };
  
  // Get rating label
  const getRatingLabel = () => {
    if (normalizedScore >= 75) return "Excellent";
    if (normalizedScore >= 50) return "Good";
    if (normalizedScore >= 25) return "Moderate";
    return "Low";
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1", className)}>
          <Leaf className={cn(getSizeClass(), getColorClass())} />
          {showLabel && (
            <span className={cn("text-sm font-medium", getColorClass())}>
              {getRatingLabel()}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Green Impact Score: {normalizedScore}/100</p>
        <p className="text-xs text-muted-foreground">
          Carbon impact rating: {getRatingLabel()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
