
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CreditCard, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SkillStakingProps {
  projectId: string;
  hasApplied: boolean;
}

export function SkillStaking({ projectId, hasApplied }: SkillStakingProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("50");
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to stake on this project",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    try {
      // In a real implementation, this would connect to your Polygon smart contract
      // via the Skill-Staking Escrow service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Stake Successful",
        description: `You've staked ${amount} USDC on this project`,
      });
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  if (hasApplied) {
    return null; // Don't show staking option if already applied
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Skill-Staking Opportunity
        </CardTitle>
        <CardDescription>
          Stake your USDC tokens to show commitment and earn rewards upon project completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Minimum Stake</span>
            <Badge variant="outline" className="font-mono">10 USDC</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Revenue Share</span>
            <Badge variant="outline" className="font-mono">5%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Insurance</span>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Covered</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="5"
              className="w-24"
            />
            <span className="font-mono text-sm">USDC</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>Staking shows your commitment and increases your match score.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStake} 
          disabled={isStaking || !user}
          className="w-full"
        >
          {isStaking ? "Processing..." : "Stake Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
