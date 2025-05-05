
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRight, ExternalLink, Users, Wallet } from 'lucide-react';
import { useSkillStaking } from '@/hooks/useSkillStaking';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RevenueSharePoolProps {
  isLoading?: boolean;
}

/**
 * RevenueSharePool - Displays active revenue sharing pools with staking information
 * 
 * This component shows ERC-4626 vault information, staking rewards, and participating users
 * with options to join pools or withdraw earnings.
 */
export function RevenueSharePool({ isLoading = false }: RevenueSharePoolProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const { revenuePools, joinPool, withdrawEarnings, error: poolError } = useSkillStaking();
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Format APY as percentage
  const formatAPY = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Handle join pool action
  const handleJoinPool = async (poolId: string) => {
    try {
      await joinPool.mutateAsync(poolId);
    } catch (error) {
      console.error("Error joining pool:", error);
    }
  };
  
  // Handle withdraw earnings action
  const handleWithdraw = async (poolId: string) => {
    try {
      await withdrawEarnings.mutateAsync(poolId);
    } catch (error) {
      console.error("Error withdrawing earnings:", error);
    }
  };
  
  if (poolError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(poolError as Error).message}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px] mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : revenuePools && revenuePools.length > 0 ? (
          // Render actual pools
          revenuePools.map((pool) => (
            <Card key={pool.id} className={selectedPool === pool.id ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{pool.name}</CardTitle>
                    <CardDescription>{pool.description}</CardDescription>
                  </div>
                  <Badge variant={pool.type === 'green' ? 'secondary' : 'default'}>
                    {pool.type.charAt(0).toUpperCase() + pool.type.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold">{formatAPY(pool.apy)}</div>
                  <p className="text-xs text-muted-foreground">Annual Percentage Yield</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value Locked</span>
                    <span className="font-medium">{formatCurrency(pool.totalValueLocked)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Users className="inline h-4 w-4 mr-1" />
                      Participants
                    </span>
                    <span className="font-medium">{pool.participantCount}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{Math.round((pool.totalValueLocked / pool.capacity) * 100)}%</span>
                    </div>
                    <Progress value={(pool.totalValueLocked / pool.capacity) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {pool.userParticipation ? (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Stake</span>
                      <span className="font-medium">{formatCurrency(pool.userParticipation.stakedAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Current Earnings</span>
                      <span className="font-medium text-green-600">{formatCurrency(pool.userParticipation.currentEarnings)}</span>
                    </div>
                    
                    <Button onClick={() => handleWithdraw(pool.id)} className="w-full mt-2" variant="outline">
                      <Wallet className="h-4 w-4 mr-2" /> Withdraw Earnings
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => handleJoinPool(pool.id)} className="w-full">
                    Join Pool <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {pool.contractAddress && (
                  <a 
                    href={`https://polygonscan.com/address/${pool.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground flex items-center justify-center mt-2 hover:text-primary"
                  >
                    View on Polygonscan <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          // No pools available
          <Card className="col-span-full flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No revenue pools available at this time.</p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
