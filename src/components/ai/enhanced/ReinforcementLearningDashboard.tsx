
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  BarChart3,
  Award,
  RefreshCw
} from "lucide-react";

interface ReinforcementLearningDashboardProps {
  agentId: string;
  onOptimizationAction: (action: string, data: any) => void;
}

export function ReinforcementLearningDashboard({ agentId, onOptimizationAction }: ReinforcementLearningDashboardProps) {
  const [learningMetrics, setLearningMetrics] = useState({
    totalEpisodes: 1247,
    averageReward: 0.78,
    explorationRate: 0.15,
    policyConvergence: 0.92,
    learningEfficiency: 0.85
  });

  const [rewardHistory, setRewardHistory] = useState([
    { episode: 1200, reward: 0.65, cumulative: 0.65 },
    { episode: 1210, reward: 0.72, cumulative: 0.68 },
    { episode: 1220, reward: 0.78, cumulative: 0.71 },
    { episode: 1230, reward: 0.81, cumulative: 0.74 },
    { episode: 1240, reward: 0.85, cumulative: 0.77 },
    { episode: 1247, reward: 0.88, cumulative: 0.78 }
  ]);

  const [agentPolicies, setAgentPolicies] = useState([
    {
      id: 'career_recommendation_policy',
      name: 'Career Recommendation Strategy',
      performance: 0.87,
      status: 'optimizing',
      actions: ['analyze_skills', 'match_opportunities', 'suggest_growth_paths'],
      recentImprovements: '+12% accuracy, +8% user satisfaction'
    },
    {
      id: 'learning_path_policy',
      name: 'Learning Path Optimization',
      performance: 0.92,
      status: 'converged',
      actions: ['assess_current_level', 'identify_gaps', 'sequence_learning'],
      recentImprovements: '+15% completion rate, +5% engagement'
    },
    {
      id: 'network_facilitation_policy',
      name: 'Network Connection Strategy',
      performance: 0.81,
      status: 'exploring',
      actions: ['analyze_compatibility', 'suggest_connections', 'facilitate_introductions'],
      recentImprovements: '+9% successful connections, +6% long-term engagement'
    }
  ]);

  const handlePolicyOptimization = (policyId: string) => {
    onOptimizationAction('optimize_policy', { policyId, agentId });
    
    // Simulate policy improvement
    setAgentPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: 'optimizing', performance: Math.min(0.99, policy.performance + 0.02) }
        : policy
    ));
  };

  const handleResetExploration = () => {
    onOptimizationAction('reset_exploration', { agentId });
    setLearningMetrics(prev => ({ ...prev, explorationRate: 0.25 }));
  };

  return (
    <div className="space-y-6">
      {/* Learning Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Episodes</span>
            </div>
            <div className="text-2xl font-bold">{learningMetrics.totalEpisodes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Avg Reward</span>
            </div>
            <div className="text-2xl font-bold">{learningMetrics.averageReward.toFixed(3)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Exploration</span>
            </div>
            <div className="text-2xl font-bold">{(learningMetrics.explorationRate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Convergence</span>
            </div>
            <div className="text-2xl font-bold">{(learningMetrics.policyConvergence * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <div className="text-2xl font-bold">{(learningMetrics.learningEfficiency * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Progress & Reward History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rewardHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="episode" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="reward" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Episode Reward"
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Cumulative Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Policies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Agent Policy Performance
            </CardTitle>
            <Button onClick={handleResetExploration} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Exploration
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {agentPolicies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{policy.name}</h3>
                  <p className="text-sm text-muted-foreground">{policy.recentImprovements}</p>
                </div>
                <Badge variant={
                  policy.status === 'converged' ? 'default' : 
                  policy.status === 'optimizing' ? 'secondary' : 'outline'
                }>
                  {policy.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Policy Performance</span>
                  <span>{(policy.performance * 100).toFixed(1)}%</span>
                </div>
                <Progress value={policy.performance * 100} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-1">
                {policy.actions.map((action, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {action.replace('_', ' ')}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={() => handlePolicyOptimization(policy.id)}
                size="sm"
                disabled={policy.status === 'optimizing'}
              >
                {policy.status === 'optimizing' ? 'Optimizing...' : 'Optimize Policy'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
