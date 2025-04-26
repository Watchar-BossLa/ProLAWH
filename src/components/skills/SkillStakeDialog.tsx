
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
import { usePolygonWallet } from "@/hooks/usePolygonWallet";
import { polygonClient } from "@/integrations/polygon/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillStakeDialogProps {
  skillId: string;
  skillName: string;
}

// Define interface for the staking contract since it's not in the generated types yet
interface StakingContract {
  id: string;
  contract_address: string;
  network: string;
}

export function SkillStakeDialog({ skillId, skillName }: SkillStakeDialogProps) {
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [stakingContracts, setStakingContracts] = useState<StakingContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>("");
  
  const { address, isConnected, connect } = usePolygonWallet();
  
  // Get the current user ID and staking contracts on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch current user
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      
      // Fetch available staking contracts using raw query to avoid type issues
      const { data, error } = await supabase
        .from('staking_contracts')
        .select('id, contract_address, network')
        .eq('active', true) as unknown as { 
          data: StakingContract[] | null, 
          error: Error | null 
        };
      
      if (error) {
        console.error("Error fetching staking contracts:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setStakingContracts(data);
        setSelectedContract(data[0].id);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleConnectWallet = async () => {
    await connect();
  };

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

    // Check wallet connection
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Polygon wallet first",
        variant: "destructive",
      });
      return;
    }
    
    // Check selected contract
    if (!selectedContract) {
      toast({
        title: "Contract required",
        description: "Please select a staking contract",
        variant: "destructive",
      });
      return;
    }
    
    const contract = stakingContracts.find(c => c.id === selectedContract);
    if (!contract) {
      toast({
        title: "Contract error",
        description: "Selected contract not found",
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    try {
      // First create blockchain transaction
      const txResult = await polygonClient.createStake(
        contract.contract_address,
        skillId,
        amountNum
      );
      
      const txHash = txResult.transactionHash;
      const txUrl = polygonClient.getTransactionUrl(txHash);
      
      // Then save to database
      const { error } = await supabase
        .from("skill_stakes")
        .insert({
          skill_id: skillId,
          amount_usdc: amountNum,
          user_id: userId,
          polygon_tx_hash: txHash,
          polygon_contract_address: contract.contract_address,
          stake_token_amount: Math.floor(amountNum * 1000000) // Convert to token units (6 decimals)
        });

      if (error) throw error;

      toast({
        title: "Stake created",
        description: (
          <div>
            Successfully staked {amount} USDC on {skillName}
            <br />
            <a href={txUrl} target="_blank" rel="noopener noreferrer" className="underline">
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
          {!isConnected && (
            <div className="mb-4">
              <Button onClick={handleConnectWallet} className="w-full">
                Connect Polygon Wallet
              </Button>
            </div>
          )}
          
          {isConnected && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="contract">Staking Contract</Label>
                <Select value={selectedContract} onValueChange={setSelectedContract}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staking contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {stakingContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.network} ({contract.contract_address.slice(0, 6)}...{contract.contract_address.slice(-4)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
            </>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake} 
            disabled={isStaking || !userId || (!isConnected && !isStaking)}
          >
            {isStaking ? "Staking..." : "Stake"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
