
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ArcadeChallenge } from "@/hooks/useArcadeChallenges";

interface ChallengeCardProps {
  challenge: ArcadeChallenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const navigate = useNavigate();
  
  const difficultyColor = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-red-500",
  }[challenge.difficulty_level];

  const handleStartChallenge = () => {
    navigate(`/dashboard/arcade/challenge/${challenge.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          <Badge className={difficultyColor}>
            {challenge.difficulty_level}
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{challenge.time_limit} seconds</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{challenge.points} points</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartChallenge} className="w-full">
          Start Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}
