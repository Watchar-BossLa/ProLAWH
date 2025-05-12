
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReadyState } from "./challenge-states/ReadyState";
import { ActiveState } from "./challenge-states/ActiveState";
import { ChallengeCompletion } from "./ChallengeCompletion";
import { type Challenge, type ChallengeContainerProps } from "@/types/arcade";
import { useChallengeState } from "@/hooks/useChallengeState";
import { useChallengeTimer } from "@/hooks/useChallengeTimer";

export const ChallengeContainer = ({ challenge, userId, onReturn }: ChallengeContainerProps) => {
  const { 
    state, 
    startChallenge, 
    completeChallenge, 
    failChallenge 
  } = useChallengeState();
  
  const [result, setResult] = useState<{
    success: boolean;
    data: Record<string, any>;
    points: number;
    timeTaken?: number;
    bonusPoints?: number;
  } | null>(null);
  
  const { totalDuration } = useChallengeTimer(challenge.time_limit, {
    tickInterval: challenge.time_limit < 30 ? 16 : 1000 // Use 60fps timing for short challenges
  });
  
  const handleStart = () => {
    startChallenge();
  };
  
  const handleComplete = (success: boolean, data: Record<string, any>, points: number) => {
    const timeTaken = challenge.time_limit - (totalDuration || 0);
    
    setResult({
      success,
      data,
      points,
      timeTaken,
      bonusPoints: data.bonusPoints || 0
    });
    
    if (success) {
      completeChallenge();
    } else {
      failChallenge();
    }
  };
  
  const handleReset = () => {
    setResult(null);
  };
  
  const renderContent = () => {
    switch (state) {
      case 'ready':
        return <ReadyState onStart={handleStart} />;
        
      case 'active':
      case 'paused':
        return (
          <ActiveState 
            challenge={challenge}
            onComplete={handleComplete}
            onReturn={onReturn}
          />
        );
        
      case 'completed':
      case 'failed':
        return result ? (
          <ChallengeCompletion 
            challengeId={challenge.id}
            score={result.points}
            timeTaken={result.timeTaken || 0}
            mediaCaptures={result.data.captures}
            bonusPoints={result.bonusPoints}
            onReset={handleReset}
          />
        ) : (
          <div className="text-center py-8">
            <p>There was an issue processing your result.</p>
            <Button onClick={handleReset} className="mt-4">Try Again</Button>
          </div>
        );
        
      default:
        return <ReadyState onStart={handleStart} />;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
