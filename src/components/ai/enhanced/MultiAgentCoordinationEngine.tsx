
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Brain, 
  Zap, 
  Users, 
  GitMerge,
  Activity,
  Target,
  MessageSquare,
  TrendingUp,
  Shield
} from "lucide-react";

interface CoordinationTask {
  id: string;
  type: 'skill_analysis' | 'career_planning' | 'opportunity_matching' | 'learning_optimization';
  status: 'pending' | 'coordinating' | 'consensus' | 'completed';
  participatingAgents: string[];
  progress: number;
  consensusScore: number;
  emergentInsights: string[];
  conflictResolution?: string;
}

interface AgentCommunication {
  id: string;
  fromAgent: string;
  toAgent: string;
  messageType: 'proposal' | 'counter_proposal' | 'agreement' | 'conflict' | 'insight';
  content: string;
  timestamp: string;
  confidence: number;
}

export function MultiAgentCoordinationEngine() {
  const [coordinationTasks, setCoordinationTasks] = useState<CoordinationTask[]>([]);
  const [agentCommunications, setAgentCommunications] = useState<AgentCommunication[]>([]);
  const [consensusMetrics, setConsensusMetrics] = useState({
    overallConsensus: 0.87,
    activeNegotiations: 3,
    resolvedConflicts: 12,
    emergentBehaviors: 8
  });

  useEffect(() => {
    // Initialize mock coordination tasks
    const mockTasks: CoordinationTask[] = [
      {
        id: 'coord-1',
        type: 'skill_analysis',
        status: 'coordinating',
        participatingAgents: ['career_twin', 'skill_advisor', 'opportunity_scout'],
        progress: 78,
        consensusScore: 0.84,
        emergentInsights: [
          'Cross-domain skill synergies detected in AI + Healthcare',
          'Market demand spike predicted for green tech skills',
          'Learning velocity optimization identified'
        ]
      },
      {
        id: 'coord-2',
        type: 'career_planning',
        status: 'consensus',
        participatingAgents: ['career_twin', 'network_facilitator'],
        progress: 92,
        consensusScore: 0.95,
        emergentInsights: [
          'Non-linear career pathway discovered',
          'Network effect amplification potential identified'
        ],
        conflictResolution: 'Weighted voting resolved timeline disagreement'
      },
      {
        id: 'coord-3',
        type: 'opportunity_matching',
        status: 'pending',
        participatingAgents: ['opportunity_scout', 'skill_advisor', 'green_skills_specialist'],
        progress: 15,
        consensusScore: 0.0,
        emergentInsights: []
      }
    ];

    const mockCommunications: AgentCommunication[] = [
      {
        id: 'comm-1',
        fromAgent: 'career_twin',
        toAgent: 'skill_advisor',
        messageType: 'proposal',
        content: 'Proposing accelerated learning path based on market trend analysis',
        timestamp: '2 minutes ago',
        confidence: 0.89
      },
      {
        id: 'comm-2',
        fromAgent: 'skill_advisor',
        toAgent: 'career_twin',
        messageType: 'counter_proposal',
        content: 'Counter: Gradual approach with skill depth prioritization',
        timestamp: '1 minute ago',
        confidence: 0.76
      },
      {
        id: 'comm-3',
        fromAgent: 'opportunity_scout',
        toAgent: 'all',
        messageType: 'insight',
        content: 'Market shift detected: Remote-first positions increasing 34%',
        timestamp: '30 seconds ago',
        confidence: 0.92
      }
    ];

    setCoordinationTasks(mockTasks);
    setAgentCommunications(mockCommunications);
  }, []);

  const handleInitiateCoordination = (taskType: CoordinationTask['type']) => {
    const newTask: CoordinationTask = {
      id: `coord-${Date.now()}`,
      type: taskType,
      status: 'pending',
      participatingAgents: getRelevantAgents(taskType),
      progress: 0,
      consensusScore: 0,
      emergentInsights: []
    };

    setCoordinationTasks(prev => [newTask, ...prev]);
  };

  const getRelevantAgents = (taskType: CoordinationTask['type']): string[] => {
    switch (taskType) {
      case 'skill_analysis':
        return ['skill_advisor', 'career_twin', 'learning_coordinator'];
      case 'career_planning':
        return ['career_twin', 'opportunity_scout', 'network_facilitator'];
      case 'opportunity_matching':
        return ['opportunity_scout', 'skill_advisor', 'network_facilitator'];
      case 'learning_optimization':
        return ['learning_coordinator', 'skill_advisor', 'career_twin'];
      default:
        return ['career_twin', 'skill_advisor'];
    }
  };

  const getStatusColor = (status: CoordinationTask['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'coordinating': return 'default';
      case 'consensus': return 'outline';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getMessageTypeIcon = (type: AgentCommunication['messageType']) => {
    switch (type) {
      case 'proposal': return Target;
      case 'counter_proposal': return GitMerge;
      case 'agreement': return Shield;
      case 'conflict': return Zap;
      case 'insight': return Brain;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      {/* Coordination Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Consensus Rate</span>
            </div>
            <div className="text-2xl font-bold">{(consensusMetrics.overallConsensus * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active Tasks</span>
            </div>
            <div className="text-2xl font-bold">{consensusMetrics.activeNegotiations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Resolved Conflicts</span>
            </div>
            <div className="text-2xl font-bold">{consensusMetrics.resolvedConflicts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Emergent Behaviors</span>
            </div>
            <div className="text-2xl font-bold">{consensusMetrics.emergentBehaviors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Coordination Interface */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Coordination Tasks</TabsTrigger>
          <TabsTrigger value="communications">Agent Communications</TabsTrigger>
          <TabsTrigger value="consensus">Consensus Building</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Multi-Agent Coordination Tasks
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleInitiateCoordination('skill_analysis')}
                  >
                    New Skill Analysis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleInitiateCoordination('career_planning')}
                  >
                    Career Planning
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {coordinationTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold capitalize">
                        {task.type.replace('_', ' ')} Coordination
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {task.participatingAgents.length} agents participating
                      </p>
                    </div>
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Coordination Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Consensus Score</span>
                      <span>{(task.consensusScore * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={task.consensusScore * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {task.participatingAgents.map((agent, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {agent.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>

                  {task.emergentInsights.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Emergent Insights:</div>
                      <div className="space-y-1">
                        {task.emergentInsights.map((insight, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.conflictResolution && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      <strong>Conflict Resolution:</strong> {task.conflictResolution}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Real-Time Agent Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentCommunications.map((comm) => {
                const IconComponent = getMessageTypeIcon(comm.messageType);
                return (
                  <div key={comm.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          {comm.fromAgent.replace('_', ' ')} 
                          {comm.toAgent !== 'all' && ` → ${comm.toAgent.replace('_', ' ')}`}
                          {comm.toAgent === 'all' && ' → All Agents'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {comm.messageType.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {comm.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm">{comm.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Confidence: {(comm.confidence * 100).toFixed(1)}%
                      </div>
                      <Progress value={comm.confidence * 100} className="h-1 w-20" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consensus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Consensus Building & Conflict Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Active Consensus Mechanisms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Weighted Voting</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Agent expertise determines vote weight in domain-specific decisions
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Evidence-Based Resolution</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Conflicts resolved through data validation and fact checking
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Hierarchical Arbitration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Senior agents mediate complex multi-party disagreements
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Collaborative Synthesis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Multiple perspectives combined into unified solutions
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Recent Conflict Resolutions</h3>
                <div className="space-y-2">
                  <div className="text-sm border-l-4 border-green-500 pl-3 py-2">
                    <strong>Learning Path Optimization:</strong> Consensus reached on adaptive vs. structured approach through weighted expertise voting
                  </div>
                  <div className="text-sm border-l-4 border-blue-500 pl-3 py-2">
                    <strong>Skill Assessment Timeline:</strong> Evidence-based resolution using market data and user preference analysis
                  </div>
                  <div className="text-sm border-l-4 border-purple-500 pl-3 py-2">
                    <strong>Network Connection Strategy:</strong> Hierarchical arbitration led to hybrid approach combining multiple agent recommendations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
