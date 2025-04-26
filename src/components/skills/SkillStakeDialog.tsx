
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { usePolygonWallet } from "@/hooks/usePolygonWallet";
import { polygonClient } from "@/integrations/polygon/client";
import { StakeForm } from "./StakeForm";
import { useStakingContracts } from "@/hooks/useStakingContracts";
import { SkillStake } from "@/types/staking";
import { useAuth } from "@/hooks/useAuth";

interface SkillStakeDialogProps {
  skillId: string;
  skillName: string;
}

export function SkillStakeDialog({ skillId, skillName }: SkillStakeDialogProps) {
  const [isStaking, setIsStaking] = useState(false);
  const [open, setOpen] = useState(false);
  const { address, isConnected, connect } = usePolygonWallet();
  const { user } = useAuth();
  const {
    stakingContracts,
    selectedContract,
    setSelectedContract,
    isLoading: isLoadingContracts
  } = useStakingContracts();

  const handleStake = async (amount: string): Promise<void> => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to stake",
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    try {
      const contract = stakingContracts.find(c => c.id === selectedContract);
      if (!contract) throw new Error("Selected contract not found");

      const txResult = await polygonClient.createStake(
        contract.contract_address,
        skillId,
        amountNum
      );
      
      const stakeData: SkillStake = {
        skill_id: skillId,
        amount_usdc: amountNum,
        user_id: user.id,
        polygon_tx_hash: txResult.transactionHash,
        polygon_contract_address: contract.contract_address,
        stake_token_amount: Math.floor(amountNum * 1000000),
        status: 'active'
      };

      const { error } = await supabase
        .from("skill_stakes")
        .insert(stakeData);

      if (error) throw error;

      toast({
        title: "Stake created",
        description: (
          <div>
            Successfully staked {amount} USDC on {skillName}
            <br />
            <a 
              href={polygonClient.getTransactionUrl(txResult.transactionHash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              View transaction
            </a>
          </div>
        ),
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Staking Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Stake on Skill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stake on {skillName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <StakeForm
            stakingContracts={stakingContracts}
            selectedContract={selectedContract}
            onContractChange={setSelectedContract}
            onSubmit={handleStake}
            isLoading={isStaking || isLoadingContracts}
            isWalletConnected={isConnected}
            onConnectWallet={connect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
