
import { Challenge } from "@/types/arcade";
import ChallengeTimer from "../ChallengeTimer";
import CameraChallenge from "@/components/arcade/CameraChallenge";
import QuizChallenge from "@/components/arcade/QuizChallenge";
import CodeChallenge from "@/components/arcade/CodeChallenge";
import ARChallenge from "@/components/arcade/ARChallenge";
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
  // Render the appropriate challenge type based on the challenge.type property
  const renderChallengeContent = () => {
    switch (challenge.type) {
      case "camera":
        return (
          <CameraChallenge 
            challenge={{
              id: challenge.id,
              validation_rules: challenge.validation_rules,
              points: challenge.points
            }} 
            onComplete={onComplete}
          />
        );
      
      case "quiz":
        return (
          <QuizChallenge
            challenge={{
              id: challenge.id,
              validation_rules: challenge.validation_rules,
              points: challenge.points,
              questions: challenge.questions
            }}
            onComplete={onComplete}
          />
        );
      
      case "code":
        return (
          <CodeChallenge
            challenge={{
              id: challenge.id,
              validation_rules: challenge.validation_rules,
              points: challenge.points
            }}
            onComplete={onComplete}
          />
        );
      
      case "ar":
        return (
          <ARChallenge 
            challenge={{
              id: challenge.id,
              validation_rules: challenge.validation_rules,
              points: challenge.points
            }}
            onComplete={onComplete}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {challenge.type.toUpperCase()} challenges are coming soon!
            </p>
            <Button onClick={onReturn} className="mt-4">
              Return to Arcade
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <ChallengeTimer 
        initialTime={challenge.time_limit} 
        onTimeUpdate={onTimeUpdate}
        onTimeUp={onTimeUp}
      />
      
      {renderChallengeContent()}
    </div>
  );
}
