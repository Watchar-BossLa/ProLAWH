
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";
import { useChallenges } from "@/hooks/useChallenges";
import { useVeriSkill } from "@/hooks/useVeriSkill";

interface ChallengeCompletionProps {
  challengeId: string;
  score: number;
  timeTaken: number;
  mediaCaptures?: string[];
  onReset: () => void;
}

export function ChallengeCompletion({ 
  challengeId, 
  score, 
  timeTaken, 
  mediaCaptures = [],
  onReset 
}: ChallengeCompletionProps) {
  const { challenge, submitChallenge } = useChallenges();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCredentialIssuing, setIsCredentialIssuing] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const { walletConnected } = useVeriSkill();
  const { issueCredential } = useBlockchainCredentials();
  
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
    if (!challenge) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await submitChallenge.mutateAsync({
        challengeId,
        score,
        timeTaken,
        status: isPassingScore ? 'completed' : 'failed',
        mediaCaptures
      });
      
      if (isPassingScore && walletConnected) {
        setIsCredentialIssuing(true);
        // Issue blockchain credential if challenge passed
        await issueCredential.mutateAsync({
          skillId: challenge.skillId || "green-skill-default", // Fallback if not defined
          metadata: {
            issuer: "ProLawh Arcade",
            verification_method: "challenge",
            achievement_level: score > (challenge.points * 0.9) ? "Expert" : "Proficient",
            verification_proof: `Challenge ${challenge.title} completed with score ${score}/${challenge.points}`
          }
        });
        setIsCredentialIssuing(false);
        
        toast({
          title: "Credential Issued!",
          description: "Your achievement has been recorded on the blockchain",
        });
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
        <div className="flex justify-between items-center">
          <span>Score</span>
          <Badge variant={isPassingScore ? "default" : "destructive"} className="ml-auto">
            {score}/{challenge?.points || 100} points
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Time taken</span>
          <span className="font-mono">{Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}</span>
        </div>
        
        {mediaCaptures && mediaCaptures.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Captured Evidence</h4>
            <div className="grid grid-cols-2 gap-2">
              {mediaCaptures.map((src, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Challenge evidence ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verifying completion...</span>
              <span>{verificationProgress}%</span>
            </div>
            <Progress value={verificationProgress} className="h-2" />
          </div>
        )}
        
        {!walletConnected && isPassingScore && !isSubmitting && (
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            Connect your wallet to receive a blockchain credential for this achievement!
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 flex-col sm:flex-row">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={onReset}
          disabled={isSubmitting || isCredentialIssuing}
        >
          Try Again
        </Button>
        
        <Button 
          className="flex-1" 
          onClick={isPassingScore && !submitChallenge.isSuccess ? handleSubmit : () => navigate('/dashboard/arcade')}
          disabled={isSubmitting || isCredentialIssuing}
        >
          {isSubmitting 
            ? "Submitting..." 
            : isCredentialIssuing 
              ? "Issuing Credential..." 
              : submitChallenge.isSuccess 
                ? "Return to Arcade" 
                : "Submit Results"}
        </Button>
      </CardFooter>
    </Card>
  );
}
