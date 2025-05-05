
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeDifficultyBadge } from "./ChallengeDifficultyBadge";
import { Clock, Trophy, Camera, Code, FileQuestion, Gamepad } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ArcadeChallenge } from "@/hooks/useArcadeChallenges";

interface ChallengeCardProps {
  challenge: ArcadeChallenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const navigate = useNavigate();
  
  const handleStartChallenge = () => {
    navigate(`/dashboard/arcade/challenge/${challenge.id}`);
  };
  
  const getChallengeTypeIcon = () => {
    switch (challenge.type) {
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'quiz':
        return <FileQuestion className="h-4 w-4" />;
      case 'ar':
        return <Gamepad className="h-4 w-4" />;
      default:
        return <Gamepad className="h-4 w-4" />;
    }
  };

  const getChallengeTypeName = () => {
    switch (challenge.type) {
      case 'camera':
        return 'Camera Challenge';
      case 'code':
        return 'Code Challenge';
      case 'quiz':
        return 'Quiz Challenge';
      case 'ar':
        return 'AR Challenge';
      default:
        return 'Challenge';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          <ChallengeDifficultyBadge level={challenge.difficulty_level} />
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {getChallengeTypeIcon()}
            <span>{getChallengeTypeName()}</span>
          </div>
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
