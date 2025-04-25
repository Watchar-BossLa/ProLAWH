
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface SkillStakeDialogProps {
  skillId: string;
  skillName: string;
}

export function SkillStakeDialog({ skillId, skillName }: SkillStakeDialogProps) {
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    fetchUser();
  }, []);

  const handleStake = async () => {
    // Validate input amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to stake on a skill",
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    try {
      const { error } = await supabase
        .from("skill_stakes")
        .insert({
          skill_id: skillId,
          amount_usdc: amountNum,
          user_id: userId, // Include the user ID in the insert operation
        });

      if (error) throw error;

      toast({
        title: "Stake created",
        description: `Successfully staked ${amount} USDC on ${skillName}`,
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
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
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter stake amount"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStake} disabled={isStaking || !userId}>
            {isStaking ? "Staking..." : "Stake"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
