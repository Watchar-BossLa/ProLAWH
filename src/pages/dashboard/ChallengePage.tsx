
import { useParams, useNavigate } from "react-router-dom";
import { ChallengeHeader } from "@/components/arcade/ChallengeHeader";
import { ChallengeContainer } from "@/components/arcade/ChallengeContainer";
import { useChallenge } from "@/hooks/useChallenge";
import { ChallengeStateProvider } from "@/hooks/useChallengeState";

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { challenge, userId } = useChallenge(challengeId);
  
  const returnToArcade = () => {
    navigate("/dashboard/arcade");
  };

  if (!challenge || !userId) {
    return <div className="text-center py-8">Loading challenge...</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <ChallengeStateProvider>
          <ChallengeHeader
            title={challenge.title}
            description={challenge.description}
            timeLimit={challenge.time_limit}
            instructions={challenge.instructions}
          />
          <ChallengeContainer
            challenge={challenge}
            userId={userId}
            onReturn={returnToArcade}
          />
        </ChallengeStateProvider>
      </div>
    </div>
  );
}
