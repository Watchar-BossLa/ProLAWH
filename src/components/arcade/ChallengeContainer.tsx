import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVeriSkill } from "@/hooks/useVeriSkill";
import { ActiveState } from "./challenge-states/ActiveState";
import { ReadyState } from "./challenge-states/ReadyState";
import ChallengeTimer from "./ChallengeTimer";
import { type Challenge, type ChallengeContainerProps, type ChallengeResult } from "@/types/arcade";
import CameraChallenge from "./CameraChallenge";
import ChallengeCompletion from "./ChallengeCompletion";

export const ChallengeContainer = ({ challenge, userId, onReturn }: ChallengeContainerProps) => {
  const { submitChallengeResult } = useVeriSkill();
  const [activeState, setActiveState] = useState<'ready' | 'active' | 'completed' | 'failed'>('ready');
  const [timeLeft, setTimeLeft] = useState(challenge.time_limit);
  const [result, setResult] = useState<ChallengeResult | null>(null);

  const handleStart = () => {
    setActiveState('active');
  };

  const handleTimeUpdate = (newTimeLeft: number) => {
    setTimeLeft(newTimeLeft);
  };

  const handleTimeUp = () => {
    if (activeState === 'active') {
      handleFailure("Time's up! Challenge failed.");
    }
  };

  const handleSuccess = async (message: string, points = challenge.points) => {
    const challengeResult = {
      success: true,
      points: points,
      message: message
    };
    
    setResult(challengeResult);
    setActiveState('completed');
    
    // Record the result in the database
    await submitChallengeResult(challenge.id, challengeResult);
  };

  const handleFailure = async (message: string) => {
    const challengeResult = {
      success: false,
      points: 0,
      message: message
    };
    
    setResult(challengeResult);
    setActiveState('failed');
    
    // Record the failed attempt
    await submitChallengeResult(challenge.id, challengeResult);
  };

  const renderChallengeContent = () => {
    switch (activeState) {
      case 'ready':
        return (
          <ReadyState 
            onStart={handleStart} 
          />
        );
      case 'active':
        return (
          <>
            <ChallengeTimer 
              initialTime={challenge.time_limit} 
              onTimeUpdate={handleTimeUpdate}
              onTimeUp={handleTimeUp}
            />
            {challenge.type === 'camera' && (
              <CameraChallenge 
                challenge={challenge}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
              />
            )}
            {/* Other challenge types would be implemented here */}
          </>
        );
      case 'completed':
      case 'failed':
        return (
          <ChallengeCompletion 
            result={result}
            onRetry={() => setActiveState('ready')}
            onReturn={onReturn}
          />
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {renderChallengeContent()}
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={onReturn}
          >
            Return to Arcade
          </Button>
          
          {activeState === 'active' && (
            <Button 
              variant="destructive"
              onClick={() => handleFailure("Challenge abandoned")}
            >
              Abandon Challenge
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
