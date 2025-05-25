
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Target,
  Leaf,
  Network,
  Zap,
  TrendingUp,
  MessageSquare
} from "lucide-react";

interface AgentSpecialization {
  id: string;
  name: string;
  domain: string;
  expertise: string[];
  performance: number;
  activeTasksCount: number;
  completedTasks: number;
  specialization_depth: number;
  reasoning_style: string;
  status: 'active' | 'learning' | 'optimizing' | 'idle';
  capabilities: string[];
  recent_achievements: string[];
}

export function DomainSpecializedAgents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agents] = useState<AgentSpecialization[]>([
    {
      id: 'career-twin-specialist',
      name: 'Career Twin Specialist',
      domain: 'Career Development',
      expertise: ['career_planning', 'skill_mapping', 'trajectory_optimization', 'market_analysis'],
      performance: 0.92,
      activeTasksCount: 12,
      completedTasks: 1847,
      specialization_depth: 0.95,
      reasoning_style: 'analytical_predictive',
      status: 'active',
      capabilities: [
        'Advanced career trajectory modeling',
        'Skills-to-opportunity mapping',
        'Market trend analysis',
        'Personalized growth planning'
      ],
      recent_achievements: [
        'Improved career match accuracy by 18%',
        'Reduced skill gap identification time by 25%',
        'Enhanced user satisfaction score to 4.7/5'
      ]
    },
    {
      id: 'green-skills-specialist',
      name: 'Green Skills Specialist',
      domain: 'Sustainability & Environment',
      expertise: ['sustainable_careers', 'green_technology', 'climate_adaptation', 'circular_economy'],
      performance: 0.89,
      activeTasksCount: 8,
      completedTasks: 923,
      specialization_depth: 0.91,
      reasoning_style: 'systems_thinking',
      status: 'learning',
      capabilities: [
        'Green career pathway identification',
        'Sustainability skill assessment',
        'Climate-conscious role matching',
        'ESG compliance guidance'
      ],
      recent_achievements: [
        'Identified 47 new green career paths',
        'Created sustainability competency framework',
        'Increased green job placements by 35%'
      ]
    },
    {
      id: 'learning-coordinator',
      name: 'Learning Coordinator',
      domain: 'Education & Training',
      expertise: ['adaptive_learning', 'curriculum_design', 'assessment_optimization', 'knowledge_transfer'],
      performance: 0.94,
      activeTasksCount: 15,
      completedTasks: 2156,
      specialization_depth: 0.97,
      reasoning_style: 'pedagogical_adaptive',
      status: 'active',
      capabilities: [
        'Personalized learning path creation',
        'Real-time difficulty adjustment',
        'Multi-modal content delivery',
        'Progress tracking & optimization'
      ],
      recent_achievements: [
        'Boosted learning completion rates by 42%',
        'Reduced average learning time by 30%',
        'Implemented AI-driven content curation'
      ]
    },
    {
      id: 'opportunity-scout',
      name: 'Opportunity Scout',
      domain: 'Job Market & Opportunities',
      expertise: ['market_intelligence', 'opportunity_identification', 'trend_analysis', 'matching_algorithms'],
      performance: 0.87,
      activeTasksCount: 18,
      completedTasks: 1634,
      specialization_depth: 0.88,
      reasoning_style: 'market_predictive',
      status: 'optimizing',
      capabilities: [
        'Real-time opportunity discovery',
        'Market demand forecasting',
        'Skill-opportunity correlation',
        'Salary trend analysis'
      ],
      recent_achievements: [
        'Discovered 230 hidden opportunities',
        'Improved match precision by 22%',
        'Expanded opportunity database by 65%'
      ]
    },
    {
      id: 'network-facilitator',
      name: 'Network Facilitator',
      domain: 'Professional Networking',
      expertise: ['relationship_mapping', 'connection_optimization', 'community_building', 'influence_analysis'],
      performance: 0.85,
      activeTasksCount: 11,
      completedTasks: 1289,
      specialization_depth: 0.86,
      reasoning_style: 'social_network_analysis',
      status: 'active',
      capabilities: [
        'Strategic connection recommendations',
        'Network strength analysis',
        'Community bridge identification',
        'Relationship nurturing guidance'
      ],
      recent_achievements: [
        'Facilitated 340 meaningful connections',
        'Increased network engagement by 28%',
        'Identified key industry influencers'
      ]
    },
    {
      id: 'skill-advisor',
      name: 'Skill Advisor',
      domain: 'Skills Development',
      expertise: ['skill_assessment', 'gap_analysis', 'competency_mapping', 'development_planning'],
      performance: 0.91,
      activeTasksCount: 14,
      completedTasks: 1978,
      specialization_depth: 0.93,
      reasoning_style: 'competency_based',
      status: 'active',
      capabilities: [
        'Comprehensive skill gap analysis',
        'Future skills prediction',
        'Micro-learning recommendations',
        'Skill transferability assessment'
      ],
      recent_achievements: [
        'Mapped 1,200+ skill relationships',
        'Improved skill assessment accuracy by 31%',
        'Created dynamic skill development plans'
      ]
    }
  ]);

  const getAgentIcon = (domain: string) => {
    switch (domain) {
      case 'Career Development': return Briefcase;
      case 'Sustainability & Environment': return Leaf;
      case 'Education & Training': return GraduationCap;
      case 'Job Market & Opportunities': return Target;
      case 'Professional Networking': return Users;
      case 'Skills Development': return Brain;
      default: return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'learning': return 'secondary';
      case 'optimizing': return 'outline';
      case 'idle': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agents Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const IconComponent = getAgentIcon(agent.domain);
          return (
            <Card 
              key={agent.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAgent === agent.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{agent.domain}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span>{(agent.performance * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.performance * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Active Tasks</div>
                    <div className="font-semibold">{agent.activeTasksCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                    <div className="font-semibold">{agent.completedTasks.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.expertise.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill.replace('_', ' ')}
                    </Badge>
                  ))}
                  {agent.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.expertise.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Agent View */}
      {selectedAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Agent Specialization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="capabilities" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="capabilities" className="mt-4">
                {(() => {
                  const agent = agents.find(a => a.id === selectedAgent);
                  if (!agent) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Core Capabilities</h3>
                        <div className="space-y-2">
                          {agent.capabilities.map((capability, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              {capability}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Domain Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {agent.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>

              <TabsContent value="performance" className="mt-4">
                {(() => {
                  const agent = agents.find(a => a.id === selectedAgent);
                  if (!agent) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {(agent.performance * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Overall Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {(agent.specialization_depth * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Specialization Depth</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {agent.activeTasksCount}
                          </div>
                          <div className="text-sm text-muted-foreground">Active Tasks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {agent.completedTasks.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Completed</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>

              <TabsContent value="reasoning" className="mt-4">
                {(() => {
                  const agent = agents.find(a => a.id === selectedAgent);
                  if (!agent) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Reasoning Style</h3>
                        <Badge variant="outline" className="text-sm">
                          {agent.reasoning_style.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Reasoning Capabilities</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            Chain-of-thought reasoning for complex problems
                          </div>
                          <div className="flex items-center gap-2">
                            <Network className="h-4 w-4 text-green-500" />
                            Multi-modal evidence integration
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            Probabilistic outcome modeling
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-orange-500" />
                            Goal-oriented decision making
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>

              <TabsContent value="achievements" className="mt-4">
                {(() => {
                  const agent = agents.find(a => a.id === selectedAgent);
                  if (!agent) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Recent Achievements</h3>
                        <div className="space-y-2">
                          {agent.recent_achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">View Detailed Reports</Button>
                        <Button size="sm" variant="outline">Optimize Agent</Button>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
