
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { useSkillStaking } from '@/hooks/useSkillStaking';
import { AlertCircle, BarChart2, Clock, CreditCard, LineChart as LineChartIcon, PieChart as PieChartIcon, Plus } from 'lucide-react';
import { SkillStakesList } from './SkillStakesList';
import { SkillStakeDialog } from './SkillStakeDialog';
import { useBiasShield } from '@/hooks/useBiasShield';
import { StakingTransactionHistory } from './StakingTransactionHistory';
import { RevenueSharePool } from './RevenueSharePool';

/**
 * SkillStakingDashboard - A comprehensive dashboard for managing skill stakes and revenue shares
 * 
 * This component provides users with an overview of their staked skills, earnings, and pools while
 * allowing them to create new stakes and monitor their performance over time.
 */
export function SkillStakingDashboard() {
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const { 
    userStakes, 
    stakedSkillsData, 
    totalStakedValue, 
    totalEarnings, 
    stakingHistoryData, 
    isLoading, 
    error,
    createStake
  } = useSkillStaking();
  const { checkForBias } = useBiasShield();
  const navigate = useNavigate();
  
  const handleCreateStake = async (data: any) => {
    try {
      // Run a bias check to ensure fair stake distribution
      const biasCheck = await checkForBias({
        action: 'stake_creation',
        amount: data.amount,
        user_id: data.userId,
        skill_id: data.skillId
      });
      
      if (!biasCheck.passed) {
        throw new Error("Bias check failed: " + biasCheck.details);
      }
      
      await createStake.mutateAsync({
        skillId: data.skillId,
        amount: data.amount,
        duration: data.duration
      });
      
      setIsStakeDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating stake:", error);
    }
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Skill Staking & Revenue-Share</h2>
        <Button onClick={() => setIsStakeDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Stake
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(totalStakedValue || 0)}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(totalEarnings || 0)}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{userStakes?.filter(stake => stake.status === 'active').length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Pools</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{userStakes?.reduce((pools, stake) => stake.poolId && !pools.includes(stake.poolId) ? [...pools, stake.poolId] : pools, [] as string[]).length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stakes" className="w-full">
        <TabsList>
          <TabsTrigger value="stakes">Your Stakes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="pools">Revenue Pools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stakes" className="space-y-4">
          {/* Use the appropriate type conversion for userStakes */}
          <SkillStakesList 
            isLoading={isLoading} 
            stakes={userStakes?.map(stake => ({
              ...stake,
              status: stake.status === 'cancelled' ? 'withdrawn' : stake.status
            })) || []} 
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Staking Distribution</CardTitle>
                <CardDescription>By skill category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <PieChart
                    data={stakedSkillsData || []}
                    valueKey="amount"
                    categoryKey="category"
                    colors={["#2563eb", "#d97706", "#059669", "#7c3aed", "#e11d48"]}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Earnings Over Time</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <LineChart
                    data={stakingHistoryData || []}
                    valueKey="earnings"
                    categoryKey="date"
                    colors={["#2563eb"]}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <StakingTransactionHistory isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="pools">
          <div className="space-y-4">
            <RevenueSharePool isLoading={isLoading} />
          </div>
        </TabsContent>
      </Tabs>
      
      <SkillStakeDialog 
        open={isStakeDialogOpen} 
        onClose={() => setIsStakeDialogOpen(false)}
        onCreateStake={handleCreateStake}
      />
    </div>
  );
}
