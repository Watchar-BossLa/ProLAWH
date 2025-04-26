
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StakingContract } from "@/types/staking";

interface StakeFormProps {
  stakingContracts: StakingContract[];
  selectedContract: string;
  onContractChange: (value: string) => void;
  onSubmit: (amount: string) => Promise<void>;
  isLoading: boolean;
  isWalletConnected: boolean;
  onConnectWallet: () => Promise<void>; // Updated to return Promise<void>
}

export function StakeForm({
  stakingContracts,
  selectedContract,
  onContractChange,
  onSubmit,
  isLoading,
  isWalletConnected,
  onConnectWallet
}: StakeFormProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount);
  };

  if (!isWalletConnected) {
    return (
      <div className="mb-4">
        <Button onClick={onConnectWallet} className="w-full">
          Connect Polygon Wallet
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="contract">Staking Contract</Label>
        <Select value={selectedContract} onValueChange={onContractChange}>
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

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading || !amount}>
          {isLoading ? "Staking..." : "Stake"}
        </Button>
      </div>
    </form>
  );
}
