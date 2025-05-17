
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";
import { toast } from "@/hooks/use-toast";

interface UseCredentialIssuerProps {
  challengeId?: string;
  challengeName?: string;
  score: number;
  totalPoints?: number;
  skillId?: string;
}

interface CredentialData {
  id: string;
  name: string;
  score: number;
  skillId: string;
  achievedAt: string;
}

export function useCredentialIssuer(props: UseCredentialIssuerProps) {
  const { 
    challengeId = "", 
    challengeName = "Unknown Challenge", 
    score, 
    totalPoints = 100,
    skillId = "green-skill-default"
  } = props;
  
  const { issueCredential } = useBlockchainCredentials();
  
  // Determine achievement level based on score percentage
  const getAchievementLevel = () => {
    const scorePercentage = score / (totalPoints || 100);
    if (scorePercentage > 0.9) return "Expert";
    if (scorePercentage > 0.7) return "Proficient";
    return "Beginner";
  };
  
  const issueCredentialForChallenge = async (): Promise<boolean> => {
    try {
      // Calculate passing score threshold (70%)
      const isPassingScore = score >= ((totalPoints || 100) * 0.7);
      
      if (!isPassingScore) {
        console.warn("Cannot issue credential for failing score");
        return false;
      }
      
      if (!challengeId) {
        console.error("Missing challenge ID for credential issuance");
        toast({
          title: "Credential Error",
          description: "Missing challenge information",
          variant: "destructive"
        });
        return false;
      }
      
      // Create credential data
      const credentialData = {
        skillId: skillId,
        metadata: {
          issuer: "ProLawh Arcade",
          verification_method: "challenge",
          achievement_level: getAchievementLevel(),
          verification_proof: `Challenge ${challengeName} completed with score ${score}/${totalPoints}`,
          id: challengeId,
          achievedAt: new Date().toISOString()
        }
      };
      
      // Issue the credential
      await issueCredential.mutateAsync(credentialData);
      
      toast({
        title: "Credential Issued!",
        description: "Your achievement has been recorded on the blockchain",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to issue credential:", error);
      
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
