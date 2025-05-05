
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StakingContract } from "@/types/staking";

export function useStakingContracts() {
  const [stakingContracts, setStakingContracts] = useState<StakingContract[]>([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // Mock data for now - in real app would fetch from Supabase
        const mockContracts: StakingContract[] = [
          {
            id: "contract1",
            contract_address: "0x1234567890abcdef1234567890abcdef12345678",
            network: "Polygon Mumbai",
          },
          {
            id: "contract2",
            contract_address: "0xabcdef1234567890abcdef1234567890abcdef12",
            network: "Polygon Mainnet",
          },
        ];

        setStakingContracts(mockContracts);
        if (mockContracts.length > 0 && !selectedContract) {
          setSelectedContract(mockContracts[0].id);
        }
      } catch (error) {
        console.error("Error fetching staking contracts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [selectedContract]);

  return {
    stakingContracts,
    selectedContract,
    setSelectedContract,
    isLoading,
  };
}
