
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StakingContract } from "@/types/staking";

export function useStakingContracts() {
  const [stakingContracts, setStakingContracts] = useState<StakingContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const { data, error } = await supabase.rpc('get_active_staking_contracts');

        if (error) throw error;

        if (data && data.length > 0) {
          setStakingContracts(data);
          setSelectedContract(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching staking contracts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch contracts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return {
    stakingContracts,
    selectedContract,
    setSelectedContract,
    isLoading,
    error
  };
}
