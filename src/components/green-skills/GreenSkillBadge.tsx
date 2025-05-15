
import { GreenSkillIndicator } from "./GreenSkillIndicator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GreenSkillBadgeProps {
  skillName: string;
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
}

export function GreenSkillBadge({
  skillName,
  score,
  className,
  size = "md",
  interactive = false,
  onClick
}: GreenSkillBadgeProps) {
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "text-xs py-0 px-2";
      case "lg": return "text-sm py-1 px-3";
      default: return "text-xs py-0.5 px-2.5";
    }
  };
  
  // Get variant based on score
  const getVariant = () => {
    if (score >= 75) return "success";
    if (score >= 50) return "default";
    if (score >= 25) return "secondary";
    return "outline";
  };
  
  return (
    <Badge
      variant={getVariant() as any}
      className={cn(
        getSizeClasses(),
        "flex items-center gap-1.5",
        interactive && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      <GreenSkillIndicator score={score} size={size === "lg" ? "md" : "sm"} />
      <span>{skillName}</span>
    </Badge>
  );
}
