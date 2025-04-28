
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChallengeDifficultyBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
}

export function ChallengeDifficultyBadge({ level }: ChallengeDifficultyBadgeProps) {
  const colors = {
    beginner: 'bg-green-500 hover:bg-green-600',
    intermediate: 'bg-yellow-500 hover:bg-yellow-600',
    advanced: 'bg-red-500 hover:bg-red-600'
  };

  return (
    <Badge className={cn(colors[level], 'capitalize')}>
      {level}
    </Badge>
  );
}
