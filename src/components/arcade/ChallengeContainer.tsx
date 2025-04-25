
import { ChallengeContainerProps } from "@/types/arcade";
import { useChallengeState } from "@/hooks/useChallengeState";
import { ReadyState } from "./challenge-states/ReadyState";
import { ActiveState } from "./challenge-states/ActiveState";
import ChallengeCompletion from "./ChallengeCompletion";

export function ChallengeContainer({ challenge, userId, onReturn }: ChallengeContainerProps) {
  const {
    status,
    timeLeft,
    result,
    setTimeLeft,
    startChallenge,
    handleComplete,
    setStatus
  } = useChallengeState(challenge.id, userId);

  const handleTimeUp = () => {
    setStatus("failed");
    handleComplete(false, {}, 0, challenge.time_limit);
  };

  if (status === "ready") {
    return <ReadyState onStart={startChallenge} />;
  }

  if (status === "active") {
    return (
      <ActiveState
        challenge={challenge}
        timeLeft={timeLeft}
        onTimeUpdate={setTimeLeft}
        onComplete={(success, data, points) => 
          handleComplete(success, data, points, challenge.time_limit - timeLeft)
        }
        onTimeUp={handleTimeUp}
        onReturn={onReturn}
      />
    );
  }

  return (
    <ChallengeCompletion 
      result={result}
      onRetry={() => {
        setStatus("ready");
        setTimeLeft(challenge.time_limit);
      }}
      onReturn={onReturn}
    />
  );
}
