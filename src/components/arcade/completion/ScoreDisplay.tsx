
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
  score: number;
  totalPoints: number;
  bonusPoints?: number;
}

export function ScoreDisplay({ score, totalPoints, bonusPoints = 0 }: ScoreDisplayProps) {
  const isPassingScore = score >= (totalPoints * 0.7);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span>Score</span>
        <Badge variant={isPassingScore ? "default" : "destructive"} className="ml-auto">
          {score}/{totalPoints} points
        </Badge>
      </div>
      
      {bonusPoints > 0 && (
        <div className="flex justify-between items-center">
          <span>Speed Bonus</span>
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            +{bonusPoints} points
          </Badge>
        </div>
      )}
    </div>
  );
}
