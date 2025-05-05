
import { useParams, useNavigate } from "react-router-dom";
import { ChallengeHeader } from "@/components/arcade/ChallengeHeader";
import { ChallengeContainer } from "@/components/arcade/ChallengeContainer";
import { useChallenge } from "@/hooks/useChallenge";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { getChallenge } = useChallenge();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  
  useEffect(() => {
    if (challengeId && user) {
      getChallenge(challengeId).then(data => {
        setChallenge(data);
      });
    }
  }, [challengeId, getChallenge, user]);

  const returnToArcade = () => {
    navigate("/dashboard/arcade");
  };

  if (!challenge || !user?.id) {
    return <div className="text-center py-8">Loading challenge...</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <ChallengeHeader
          title={challenge.title}
          description={challenge.description}
          timeLimit={challenge.time_limit}
          instructions={challenge.instructions}
        />
        <ChallengeContainer
          challenge={challenge}
          userId={user.id}
          onReturn={returnToArcade}
        />
      </div>
    </div>
  );
}
