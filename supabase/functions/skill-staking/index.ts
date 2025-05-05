
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Polygon integration via ethers.js
// This would be a real implementation connecting to Polygon
// For demo, we're using a mock implementation
const mockPolygonIntegration = {
  async stakeSkill(skillId: string, amount: number, duration?: string) {
    console.log(`Staking on Polygon: skillId=${skillId}, amount=${amount}, duration=${duration}`);
    // Mock successful transaction
    return {
      transactionHash: `0x${Math.random().toString(16).substring(2)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
  },
  
  async joinPool(poolId: string, userId: string) {
    console.log(`Joining pool on Polygon: poolId=${poolId}, userId=${userId}`);
    // Mock successful transaction
    return {
      transactionHash: `0x${Math.random().toString(16).substring(2)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
  },
  
  async withdrawEarnings(poolId: string, userId: string) {
    console.log(`Withdrawing earnings from Polygon: poolId=${poolId}, userId=${userId}`);
    const mockAmount = Math.random() * 10 + 1; // Random amount between 1-11
    // Mock successful transaction
    return {
      transactionHash: `0x${Math.random().toString(16).substring(2)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      amount: mockAmount
    };
  },
  
  async getContractAbi(contractAddress: string) {
    console.log(`Getting contract ABI for: ${contractAddress}`);
    return {
      abi: [
        {
          "inputs": [],
          "name": "name",
          "outputs": [{"internalType": "string", "name": "", "type": "string"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalAssets",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error(userError?.message || 'Authentication required');
    }

    const { action, skillId, amount, duration, poolId } = await req.json();
    
    switch (action) {
      case 'stake': {
        if (!skillId || !amount) {
          throw new Error('SkillId and amount are required');
        }
        
        // 1. Call Polygon contract to stake
        const txResult = await mockPolygonIntegration.stakeSkill(skillId, amount, duration);
        
        // 2. Log the transaction in our database
        const { error: txError } = await supabaseClient
          .from('user_activity_logs')
          .insert({
            user_id: user.id,
            activity_type: 'skill_staking',
            metadata: {
              action: 'stake',
              skill_id: skillId,
              amount,
              transaction_hash: txResult.transactionHash,
              block_number: txResult.blockNumber
            }
          });
        
        if (txError) {
          console.error("Error logging transaction:", txError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            transaction: txResult,
            message: "Stake created successfully" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'joinPool': {
        if (!poolId) {
          throw new Error('PoolId is required');
        }
        
        // 1. Call Polygon contract to join pool
        const txResult = await mockPolygonIntegration.joinPool(poolId, user.id);
        
        // 2. Log the transaction
        const { error: txError } = await supabaseClient
          .from('user_activity_logs')
          .insert({
            user_id: user.id,
            activity_type: 'pool_join',
            metadata: {
              pool_id: poolId,
              transaction_hash: txResult.transactionHash,
              timestamp: txResult.timestamp
            }
          });
        
        if (txError) {
          console.error("Error logging pool join:", txError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            transaction: txResult,
            message: "Successfully joined pool" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'withdrawEarnings': {
        if (!poolId) {
          throw new Error('PoolId is required');
        }
        
        // 1. Call Polygon contract to withdraw earnings
        const txResult = await mockPolygonIntegration.withdrawEarnings(poolId, user.id);
        
        // 2. Log the transaction
        const { error: txError } = await supabaseClient
          .from('user_activity_logs')
          .insert({
            user_id: user.id,
            activity_type: 'earnings_withdrawal',
            metadata: {
              pool_id: poolId,
              amount: txResult.amount,
              transaction_hash: txResult.transactionHash,
              timestamp: txResult.timestamp
            }
          });
        
        if (txError) {
          console.error("Error logging withdrawal:", txError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            transaction: txResult,
            amount: txResult.amount,
            message: "Earnings successfully withdrawn" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'getContractDetails': {
        const { contractAddress } = await req.json();
        if (!contractAddress) {
          throw new Error('Contract address is required');
        }
        
        const contractInfo = await mockPolygonIntegration.getContractAbi(contractAddress);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            contract: contractInfo
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    );
  }
});
