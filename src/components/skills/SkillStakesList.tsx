
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Link } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillStake {
  id: string;
  skill_name: string;
  skill_category: string;
  amount_usdc: number;
  status: "active" | "completed" | "withdrawn";
  started_at: string;
  polygon_tx_hash?: string;
  polygon_contract_address?: string;
}

export function SkillStakesList() {
  const [stakes, setStakes] = useState<SkillStake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStakes = async () => {
      const { data, error } = await supabase
        .from("active_stakes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stakes:", error);
        return;
      }

      setStakes(data);
      setIsLoading(false);
    };

    fetchStakes();

    // Subscribe to changes
    const channel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "skill_stakes",
        },
        () => fetchStakes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTransactionUrl = (txHash: string, contractAddress: string) => {
    // For now, default to Mumbai testnet
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount (USDC)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Blockchain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (stakes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Stakes</h3>
        <p className="text-muted-foreground">
          Start staking on your skills to earn rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-in fade-in-50 duration-500">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount (USDC)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Blockchain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stakes.map((stake) => (
            <TableRow key={stake.id}>
              <TableCell>{stake.skill_name}</TableCell>
              <TableCell>{stake.skill_category}</TableCell>
              <TableCell>{stake.amount_usdc}</TableCell>
              <TableCell>
                <Badge variant={stake.status === 'active' ? 'default' : 
                               stake.status === 'completed' ? 'secondary' : 'destructive'}>
                  {stake.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(stake.started_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                {stake.polygon_tx_hash ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    asChild
                  >
                    <a 
                      href={getTransactionUrl(stake.polygon_tx_hash, stake.polygon_contract_address || '')} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3" /> View
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">Not on-chain</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
