
import { Challenge } from "@/types/arcade";
import { ChallengeTimer } from "../ChallengeTimer";
import { CameraChallenge } from "../CameraChallenge";
import { Button } from "@/components/ui/button";
import { useChallengeState } from "@/hooks/useChallengeState";

interface ActiveStateProps {
  challenge: Challenge;
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
  onReturn: () => void;
}

export function ActiveState({ 
  challenge,
  onComplete,
  onReturn
}: ActiveStateProps) {
  const { failChallenge } = useChallengeState();

  const handleTimeUp = () => {
    onComplete(false, { reason: "time_expired" }, 0);
  };
  
  const handleChallengeComplete = (captures: string[]) => {
    // Calculate success based on required items and captured images
    const requiredItemsCount = challenge.validation_rules.required_items.length;
    const capturedCount = captures.length;
    
    // Simple success calculation - can be enhanced with more complex logic
    const isSuccess = capturedCount >= Math.max(1, requiredItemsCount);
    const earnedPoints = isSuccess ? challenge.points : 0;
    
    // Calculate bonus points for speed (if completed successfully)
    let bonusPoints = 0;
    if (isSuccess) {
      // Award bonus points based on challenge type
      if (challenge.type === "camera") {
        bonusPoints = Math.floor(challenge.points * 0.2); // 20% bonus for camera challenges
      }
    }
    
    const totalPoints = earnedPoints + bonusPoints;
    
    onComplete(isSuccess, { 
      captures,
      bonusPoints,
      totalPoints 
    }, totalPoints);
  };

  // Determine if we should use high precision timer (for fast challenges)
  const useHighPrecision = challenge.time_limit < 30;

  return (
    <div className="space-y-4">
      <ChallengeTimer 
        duration={challenge.time_limit} 
        onTimeUp={handleTimeUp}
        highPrecision={useHighPrecision}
      />
      
      {challenge.type === "camera" ? (
        <CameraChallenge 
          requiredItems={challenge.validation_rules.required_items}
          onComplete={handleChallengeComplete}
          minCaptures={Math.max(1, challenge.validation_rules.required_items.length)}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {challenge.type.toUpperCase()} challenges are coming soon!
          </p>
          <Button onClick={onReturn} className="mt-4">
            Return to Arcade
          </Button>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          variant="destructive" 
          onClick={() => {
            failChallenge();
            onComplete(false, { reason: "abandoned" }, 0);
          }}
        >
          Abandon Challenge
        </Button>
      </div>
    </div>
  );
}
