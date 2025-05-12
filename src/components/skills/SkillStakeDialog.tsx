
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useVeriSkill } from "@/hooks/useVeriSkill";
import { ConnectWalletButton } from "./ConnectWalletButton";

interface SkillStakeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
}

export default function SkillStakeDialog({
  isOpen,
  onClose,
  skillId,
  skillName,
}: SkillStakeDialogProps) {
  const [amount, setAmount] = useState(10);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();
  const { stakeSkill, walletConnected } = useVeriSkill();

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleStake = async () => {
    if (!walletConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);

    try {
      const success = await stakeSkill({
        skill_id: skillId,
        amount_usdc: amount,
        user_id: "", // This will be set in the hook
      });

      if (success) {
        toast({
          title: "Skill Staked",
          description: `Successfully staked ${amount} USDC on ${skillName}`,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "An error occurred while staking your skill",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stake on {skillName}</DialogTitle>
          <DialogDescription>
            Stake USDC tokens to verify your confidence in this skill. You can
            earn rewards when your skill is validated.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {!walletConnected && (
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to stake on skills
              </p>
              <ConnectWalletButton />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Stake Amount: {amount} USDC
            </label>
            <Slider
              id="amount"
              disabled={!walletConnected || isStaking}
              min={5}
              max={100}
              step={1}
              defaultValue={[amount]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="custom-amount" className="text-sm font-medium">
              Or enter custom amount:
            </label>
            <Input
              id="custom-amount"
              disabled={!walletConnected || isStaking}
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              This is a Polygon-based staking. You'll need USDC on Polygon network.
              Funds will be locked until skill verification is complete.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isStaking}>
            Cancel
          </Button>
          <Button onClick={handleStake} disabled={!walletConnected || isStaking}>
            {isStaking ? "Staking..." : `Stake ${amount} USDC`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
