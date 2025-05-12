
import { Challenge } from "@/types/arcade";
import ChallengeTimer from "../ChallengeTimer";
import CameraChallenge from "../CameraChallenge";
import { Button } from "@/components/ui/button";

interface ActiveStateProps {
  challenge: Challenge;
  timeLeft: number;
  onTimeUpdate: (time: number) => void;
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
  onTimeUp: () => void;
  onReturn: () => void;
}

export function ActiveState({ 
  challenge,
  timeLeft,
  onTimeUpdate,
  onComplete,
  onTimeUp,
  onReturn
}: ActiveStateProps) {
  return (
    <div className="space-y-4">
      <ChallengeTimer 
        initialTime={challenge.time_limit} 
        onTimeUpdate={onTimeUpdate}
        onTimeUp={onTimeUp}
      />
      
      {challenge.type === "camera" ? (
        <CameraChallenge 
          challenge={{
            id: challenge.id,
            validation_rules: challenge.validation_rules,
            points: challenge.points
          }} 
          onComplete={onComplete}
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
    </div>
  );
}
