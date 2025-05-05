
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
  open: boolean;
  onClose: () => void;
  onCreateStake: (data: any) => Promise<void>;
}

export function SkillStakeDialog({ open, onClose, onCreateStake }: SkillStakeDialogProps) {
  const [isStaking, setIsStaking] = useState(false);
  const { address, isConnected, connect } = usePolygonWallet();
  const { user } = useAuth();
  const {
    stakingContracts,
    selectedContract,
    setSelectedContract,
    isLoading: isLoadingContracts
  } = useStakingContracts();

  const handleStake = async (amount: string): Promise<void> => {
    try {
      await onCreateStake({ amount: parseFloat(amount) });
    } catch (error: any) {
      toast({
        title: "Staking Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
