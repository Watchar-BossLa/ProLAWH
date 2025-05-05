
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
  open?: boolean;
  onClose?: () => void;
  onCreateStake?: (data: any) => Promise<void>;
  skillId?: string;
  skillName?: string;
}

export function SkillStakeDialog({ 
  open, 
  onClose, 
  onCreateStake,
  skillId,
  skillName 
}: SkillStakeDialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  const [isStaking, setIsStaking] = useState(false);
  const { address, isConnected, connect } = usePolygonWallet();
  const { user } = useAuth();
  const {
    stakingContracts,
    selectedContract,
    setSelectedContract,
    isLoading: isLoadingContracts
  } = useStakingContracts();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  const handleStake = async (amount: string): Promise<void> => {
    try {
      if (onCreateStake) {
        await onCreateStake({ amount: parseFloat(amount), skillId, skillName });
      } else if (skillId) {
        setIsStaking(true);
        const address = await connect();
        // Ignore the returned address, we only care that it succeeded
        
        const contract = stakingContracts.find(c => c.id === selectedContract);
        if (!contract) throw new Error("No contract selected");
        
        const result = await polygonClient.createStake(
          contract.contract_address,
          skillId,
          parseFloat(amount)
        );
        
        toast({
          title: "Stake created",
          description: `Successfully staked ${amount} USDC on ${skillName || "skill"}`,
        });
        
        handleClose();
      }
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

  // If being used as a standalone component
  if (!open && onClose === undefined) {
    return (
      <>
        <Button onClick={() => setIsOpen(true)} className="w-full">Stake on Skill</Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Stake on {skillName || "Skill"}</DialogTitle>
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
      </>
    );
  }

  // If being controlled by parent
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Stake</DialogTitle>
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
