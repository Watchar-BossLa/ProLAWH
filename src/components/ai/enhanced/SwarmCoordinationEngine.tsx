
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Network, 
  Zap, 
  Users, 
  Target,
  TrendingUp,
  GitMerge,
  Lightbulb
} from "lucide-react";

interface SwarmCoordinationEngineProps {
  agents: any[];
  onSwarmAction: (action: string, data: any) => void;
}

export function SwarmCoordinationEngine({ agents, onSwarmAction }: SwarmCoordinationEngineProps) {
  const [activeSwarms, setActiveSwarms] = useState<any[]>([]);
  const [swarmMetrics, setSwarmMetrics] = useState({
    totalSwarms: 0,
    activeCoordinations: 0,
    collectiveIntelligence: 0,
    emergentBehaviors: 0
  });

  useEffect(() => {
    // Simulate swarm formation and coordination
    const mockSwarms = [
      {
        id: 'swarm-1',
        name: 'Career Path Optimization',
        participants: ['career_twin', 'skill_advisor', 'opportunity_scout'],
        task: 'Optimize user career trajectory using collective intelligence',
        status: 'active',
        progress: 75,
        emergentInsights: [
          'Cross-domain skill synergies detected',
          'Market trend correlation identified',
          'Optimal learning sequence emerged'
        ]
      },
      {
        id: 'swarm-2',
        name: 'Green Skills Network Analysis',
        participants: ['green_skills_specialist', 'network_facilitator', 'learning_coordinator'],
        task: 'Map sustainable career opportunities across network',
        status: 'coordinating',
        progress: 45,
        emergentInsights: [
          'Hidden sustainability pathways discovered',
          'Community expertise clusters identified'
        ]
      }
    ];

    setActiveSwarms(mockSwarms);
    setSwarmMetrics({
      totalSwarms: mockSwarms.length,
      activeCoordinations: mockSwarms.filter(s => s.status === 'active').length,
      collectiveIntelligence: 85,
      emergentBehaviors: mockSwarms.reduce((acc, s) => acc + s.emergentInsights.length, 0)
    });
  }, []);

  const handleInitiateSwarm = (task: string) => {
    onSwarmAction('initiate_swarm', { task, agents: agents.slice(0, 3) });
  };

  return (
    <div className="space-y-6">
      {/* Swarm Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active Swarms</span>
            </div>
            <div className="text-2xl font-bold">{swarmMetrics.totalSwarms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Coordinations</span>
            </div>
            <div className="text-2xl font-bold">{swarmMetrics.activeCoordinations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Collective IQ</span>
            </div>
            <div className="text-2xl font-bold">{swarmMetrics.collectiveIntelligence}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Emergent Insights</span>
            </div>
            <div className="text-2xl font-bold">{swarmMetrics.emergentBehaviors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Swarms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Active Swarm Coordinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSwarms.map((swarm) => (
            <div key={swarm.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{swarm.name}</h3>
                  <p className="text-sm text-muted-foreground">{swarm.task}</p>
                </div>
                <Badge variant={swarm.status === 'active' ? 'default' : 'secondary'}>
                  {swarm.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Coordination Progress</span>
                  <span>{swarm.progress}%</span>
                </div>
                <Progress value={swarm.progress} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-1">
                {swarm.participants.map((participant: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {participant.replace('_', ' ')}
                  </Badge>
                ))}
              </div>

              {swarm.emergentInsights.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Emergent Insights:</div>
                  <div className="space-y-1">
                    {swarm.emergentInsights.map((insight: string, index: number) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Swarm Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Initiate New Swarm Coordination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={() => handleInitiateSwarm('skill_gap_analysis')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Skill Gap Analysis Swarm
            </Button>
            <Button 
              onClick={() => handleInitiateSwarm('opportunity_matching')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Opportunity Matching Swarm
            </Button>
            <Button 
              onClick={() => handleInitiateSwarm('learning_optimization')}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Learning Path Optimization
            </Button>
            <Button 
              onClick={() => handleInitiateSwarm('network_expansion')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Network Expansion Swarm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
