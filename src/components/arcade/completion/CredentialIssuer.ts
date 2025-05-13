
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";

interface UseCredentialIssuerProps {
  challengeId?: string;
  challengeName?: string;
  score: number;
  totalPoints?: number;
  skillId?: string;
}

export function useCredentialIssuer(props: UseCredentialIssuerProps) {
  const { challengeId, challengeName, score, totalPoints, skillId } = props;
  const { issueCredential } = useBlockchainCredentials();
  
  const issueCredentialForChallenge = async () => {
    if (!challengeId || !challengeName || !totalPoints || !skillId) {
      console.error("Missing required properties for credential issuance");
      return false;
    }
    
    try {
      // Calculate passing score threshold (70%)
      const isPassingScore = score >= (totalPoints * 0.7);
      
      if (!isPassingScore) {
        console.warn("Cannot issue credential for failing score");
        return false;
      }
      
      // Prepare credential data
      const credentialData = {
        id: challengeId,
        name: challengeName,
        score,
        skillId,
        achievedAt: new Date().toISOString()
      };
      
      // Issue the actual credential
      await issueCredential(credentialData);
      
      return true;
    } catch (error) {
      console.error("Failed to issue credential:", error);
      return false;
    }
  };
  
  return {
    issueCredentialForChallenge
  };
}
