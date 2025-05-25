
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwarmCoordinationEngine } from "@/components/ai/enhanced/SwarmCoordinationEngine";
import { ReinforcementLearningDashboard } from "@/components/ai/enhanced/ReinforcementLearningDashboard";
import { DomainSpecializedAgents } from "@/components/ai/enhanced/DomainSpecializedAgents";
import { MultiAgentCoordinationEngine } from "@/components/ai/enhanced/MultiAgentCoordinationEngine";
import { AdaptiveLearningEngine } from "@/components/ai/enhanced/AdaptiveLearningEngine";
import { useEnhancedAgenticAssistant } from "@/hooks/useEnhancedAgenticAssistant";
import { 
  Brain, 
  Network, 
  TrendingUp, 
  Zap,
  GitMerge,
  Target,
  Users,
  BarChart3,
  Activity,
  MessageSquare
} from "lucide-react";

export default function EnhancedAIDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    enhancedAgents,
    activeSwarms,
    reasoningChains,
    learningStates,
    isLoading,
    createSwarmCoordination,
    generateReasoningChain,
    updateReinforcementLearning
  } = useEnhancedAgenticAssistant();

  const handleSwarmAction = async (action: string, data: any) => {
    switch (action) {
      case 'initiate_swarm':
        await createSwarmCoordination(data.task, data.agents.map((a: any) => a.id));
        break;
      default:
        console.log(`Swarm action: ${action}`, data);
    }
  };

  const handleOptimizationAction = async (action: string, data: any) => {
    switch (action) {
      case 'optimize_policy':
        await updateReinforcementLearning(data.agentId, 'policy_optimization', 0.15, {});
        break;
      case 'reset_exploration':
        await updateReinforcementLearning(data.agentId, 'exploration_reset', 0.1, {});
        break;
      default:
        console.log(`Optimization action: ${action}`, data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Brain className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-muted-foreground">Initializing enhanced AI systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Enhanced AI & ML Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced agentic systems with swarm intelligence, reinforcement learning, and sophisticated coordination
          </p>
        </div>
      </div>

      {/* Enhanced System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enhancedAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              Enhanced reasoning & coordination
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swarm Coordinations</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSwarms.length}</div>
            <p className="text-xs text-muted-foreground">
              Multi-agent collaborations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reasoning Chains</CardTitle>
            <GitMerge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reasoningChains.length}</div>
            <p className="text-xs text-muted-foreground">
              Complex decision processes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Episodes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningStates.reduce((total, state) => total + state.learning_episode, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              RL optimization cycles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consensus Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Multi-agent agreement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
          <TabsTrigger value="swarm">Swarm Intel</TabsTrigger>
          <TabsTrigger value="learning">RL Engine</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  System Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multi-Agent Coordination</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Swarm Intelligence</span>
                    <Badge variant="default">Optimizing</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reinforcement Learning</span>
                    <Badge variant="default">Learning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chain-of-Thought Reasoning</span>
                    <Badge variant="default">Enhanced</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Domain Specialization</span>
                    <Badge variant="default">Advanced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Collective Intelligence</span>
                      <span>89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Agent Coordination Efficiency</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Learning Convergence Rate</span>
                      <span>76%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reasoning Accuracy</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => setActiveTab("swarm")}
                  className="flex items-center gap-2"
                >
                  <Network className="h-4 w-4" />
                  Create Swarm
                </Button>
                <Button 
                  onClick={() => setActiveTab("agents")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Manage Agents
                </Button>
                <Button 
                  onClick={() => setActiveTab("learning")}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Optimize Learning
                </Button>
                <Button 
                  onClick={() => setActiveTab("reasoning")}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Advanced Reasoning
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <DomainSpecializedAgents />
        </TabsContent>

        <TabsContent value="coordination">
          <MultiAgentCoordinationEngine />
        </TabsContent>

        <TabsContent value="swarm">
          <SwarmCoordinationEngine 
            agents={enhancedAgents}
            onSwarmAction={handleSwarmAction}
          />
        </TabsContent>

        <TabsContent value="learning">
          <ReinforcementLearningDashboard 
            agentId="primary-agent"
            onOptimizationAction={handleOptimizationAction}
          />
        </TabsContent>

        <TabsContent value="adaptive">
          <AdaptiveLearningEngine />
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Advanced Reasoning Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Chain-of-Thought Reasoning</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Multi-step logical reasoning with explicit thought processes
                    </p>
                    <Button size="sm">Generate Reasoning Chain</Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Causal Inference</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Understanding cause-and-effect relationships in complex scenarios
                    </p>
                    <Button size="sm">Analyze Causality</Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Probabilistic Reasoning</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Handling uncertainty and probabilistic outcomes
                    </p>
                    <Button size="sm">Calculate Probabilities</Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Analogical Reasoning</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Drawing insights from similar situations and patterns
                    </p>
                    <Button size="sm">Find Analogies</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {reasoningChains.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reasoning Chains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reasoningChains.slice(0, 3).map((chain) => (
                    <div key={chain.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Agent {chain.agent_id}</span>
                        <Badge variant="outline">
                          {(chain.confidence_score * 100).toFixed(1)}% confidence
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {chain.reasoning_steps.length} reasoning steps completed
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
