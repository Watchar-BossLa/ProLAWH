
import { toast } from "@/hooks/use-toast";
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";

interface UseCredentialIssuerProps {
  challengeId: string;
  challengeName?: string;
  score: number;
  skillId?: string;
  totalPoints?: number;
}

export function useCredentialIssuer({
  challengeId,
  challengeName = "Unknown Challenge",
  score,
  skillId = "green-skill-default",
  totalPoints = 100
}: UseCredentialIssuerProps) {
  const { issueCredential } = useBlockchainCredentials();
  
  // Determine achievement level based on score percentage
  const getAchievementLevel = () => {
    const scorePercentage = score / totalPoints;
    if (scorePercentage > 0.9) return "Expert";
    if (scorePercentage > 0.7) return "Proficient";
    return "Beginner";
  };
  
  const issueCredentialForChallenge = async () => {
    try {
      await issueCredential.mutateAsync({
        skillId: skillId,
        metadata: {
          issuer: "ProLawh Arcade",
          verification_method: "challenge",
          achievement_level: getAchievementLevel(),
          verification_proof: `Challenge ${challengeName} completed with score ${score}/${totalPoints}`
        }
      });
      
      toast({
        title: "Credential Issued!",
        description: "Your achievement has been recorded on the blockchain",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to issue credential",
        description: "There was an error issuing your credential",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return {
    issueCredentialForChallenge,
    isLoading: issueCredential.isPending
  };
}
