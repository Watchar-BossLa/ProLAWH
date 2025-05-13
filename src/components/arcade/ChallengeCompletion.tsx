
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Confetti } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";
import { useChallenges } from "@/hooks/useChallenges";
import { useVeriSkill } from "@/hooks/useVeriSkill";

// Import refactored components
import { ScoreDisplay } from "./completion/ScoreDisplay";
import { MediaCaptureGallery } from "./completion/MediaCaptureGallery";
import { VerificationProgress } from "./completion/VerificationProgress";
import { WalletPrompt } from "./completion/WalletPrompt";
import { CompletionFooter } from "./completion/CompletionFooter";
import { useCredentialIssuer } from "./completion/CredentialIssuer";

interface ChallengeCompletionProps {
  challengeId: string;
  score: number;
  timeTaken: number;
  mediaCaptures?: string[];
  bonusPoints?: number;
  onReset: () => void;
}

export function ChallengeCompletion({ 
  challengeId, 
  score, 
  timeTaken, 
  mediaCaptures = [],
  bonusPoints = 0,
  onReset 
}: ChallengeCompletionProps) {
  const { challenge, submitChallenge } = useChallenges();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCredentialIssuing, setIsCredentialIssuing] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const { walletConnected } = useVeriSkill();
  
  // Use the credential issuer hook
  const { issueCredentialForChallenge } = useCredentialIssuer({
    challengeId,
    challengeName: challenge?.title,
    score,
    skillId: challenge?.skillId,
    totalPoints: challenge?.points
  });
  
  // Animation for verification progress
  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setVerificationProgress(prev => {
          const newValue = prev + 5;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [isSubmitting]);
  
  // Reset progress when not submitting
  useEffect(() => {
    if (!isSubmitting) {
      setVerificationProgress(0);
    }
  }, [isSubmitting]);
  
  const isPassingScore = challenge ? score >= (challenge.points * 0.7) : false;
  
  const handleSubmit = async () => {
    // If already submitted successfully, navigate back to arcade
    if (submitChallenge.isSuccess) {
      navigate('/dashboard/arcade');
      return;
    }
    
    if (!challenge) return;
    
    setIsSubmitting(true);
    
    try {
      await submitChallenge.mutateAsync({
        challengeId,
        score,
        timeTaken,
        status: isPassingScore ? 'completed' : 'failed',
        mediaCaptures
      });
      
      if (isPassingScore && walletConnected) {
        setIsCredentialIssuing(true);
        // Issue blockchain credential if challenge passed
        await issueCredentialForChallenge();
        setIsCredentialIssuing(false);
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          {isPassingScore && <Confetti className="h-6 w-6 text-green-500" />}
          Challenge {isPassingScore ? "Completed!" : "Attempted"}
        </CardTitle>
        <CardDescription>
          {isPassingScore 
            ? "Great job! You've successfully completed this challenge." 
            : "You didn't reach the passing score. Try again!"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScoreDisplay 
          score={score} 
          totalPoints={challenge?.points || 100}
          bonusPoints={bonusPoints}
        />
        
        <div className="flex justify-between items-center">
          <span>Time taken</span>
          <span className="font-mono">{Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}</span>
        </div>
        
        <MediaCaptureGallery mediaCaptures={mediaCaptures} />
        
        <VerificationProgress 
          isSubmitting={isSubmitting} 
          progress={verificationProgress} 
        />
        
        <WalletPrompt 
          show={!walletConnected && isPassingScore && !isSubmitting} 
        />
      </CardContent>
      
      <CardFooter>
        <CompletionFooter
          onReset={onReset}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isCredentialIssuing={isCredentialIssuing}
          isSuccess={submitChallenge.isSuccess}
        />
      </CardFooter>
    </Card>
  );
}
