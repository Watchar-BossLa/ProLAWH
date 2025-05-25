
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuantumMatching } from "@/hooks/useQuantumMatching";
import { useAgenticAssistant } from "@/hooks/useAgenticAssistant";
import { 
  Atom, 
  Brain, 
  Zap, 
  Network, 
  Target, 
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Activity
} from "lucide-react";

interface QuantumMatchingDashboardProps {
  userSkills: string[];
  careerGoals: string[];
}

export function QuantumMatchingDashboard({ 
  userSkills, 
  careerGoals 
}: QuantumMatchingDashboardProps) {
  const {
    quantumVectors,
    matches,
    entanglements,
    isLoading: isQuantumLoading,
    prepareQuantumState,
    performQuantumMeasurement,
    buildEntanglementNetwork
  } = useQuantumMatching();

  const {
    agents,
    actions,
    isProcessing,
    initializeAgent,
    generateProactiveAction,
    processUserFeedback
  } = useAgenticAssistant();

  const [isInitialized, setIsInitialized] = useState(false);
  const [quantumCoherence, setQuantumCoherence] = useState(0);

  // Initialize quantum system and AI agents
  useEffect(() => {
    const initializeSystem = async () => {
      if (userSkills.length > 0 && !isInitialized) {
        // Initialize AI agents
        await initializeAgent('career_twin', userSkills, careerGoals);
        await initializeAgent('opportunity_scout', userSkills, careerGoals);
        
        // Prepare quantum state
        const vectors = await prepareQuantumState(userSkills);
        if (vectors) {
          // Build entanglement network
          await buildEntanglementNetwork(userSkills);
          
          // Calculate overall quantum coherence
          const avgCoherence = vectors.reduce((sum, v) => sum + v.coherence_score, 0) / vectors.length;
          setQuantumCoherence(avgCoherence);
        }
        
        setIsInitialized(true);
      }
    };

    initializeSystem();
  }, [userSkills, careerGoals, isInitialized]);

  // Trigger quantum measurement for opportunities
  const handleFindMatches = async () => {
    // Simulate finding opportunities/projects to match against
    const mockTargetIds = ['proj_1', 'proj_2', 'proj_3', 'mentor_1', 'job_1'];
    await performQuantumMeasurement(quantumVectors, 'project', mockTargetIds);
    
    // Generate AI assistant actions based on matches
    if (agents.length > 0) {
      await generateProactiveAction(
        agents[0], 
        'quantum_matches_found',
        { matches_count: matches.length }
      );
    }
  };

  const handleActionFeedback = async (actionId: string, feedback: 'positive' | 'negative') => {
    await processUserFeedback(actionId, feedback);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Quantum-Enhanced Matching</h2>
          <p className="text-muted-foreground">
            Advanced AI-powered skill matching using quantum-inspired algorithms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? "Quantum State Prepared" : "Initializing"}
          </Badge>
          <Atom className="h-5 w-5 text-primary animate-spin" />
        </div>
      </div>

      {/* Quantum Coherence Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quantum Coherence Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Coherence</span>
              <span>{(quantumCoherence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={quantumCoherence * 100} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Higher coherence enables more accurate quantum matching
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quantum-matches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quantum-matches" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Quantum Matches
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="entanglement" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Skill Entanglement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quantum-matches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quantum Match Results</h3>
            <Button 
              onClick={handleFindMatches}
              disabled={isQuantumLoading || !isInitialized}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isQuantumLoading ? "Measuring..." : "Find Quantum Matches"}
            </Button>
          </div>

          <div className="grid gap-4">
            {matches.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Atom className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No quantum matches yet. Click "Find Quantum Matches" to begin measurement.
                  </p>
                </CardContent>
              </Card>
            ) : (
              matches.map((match) => (
                <Card key={match.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">Match #{match.target_id}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {match.target_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-1">
                          {(match.quantum_score * 100).toFixed(1)}% Quantum
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Classical: {(match.classical_score * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quantum Advantage</span>
                          <span>{((match.quantum_score - match.classical_score) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(match.quantum_score - match.classical_score) * 100} 
                          className="h-1"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Measurement Confidence</span>
                          <span>{(match.measurement_confidence * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={match.measurement_confidence * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>

                    {match.superposition_state.quantum_advantages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Quantum Advantages:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.superposition_state.quantum_advantages.slice(0, 3).map((advantage, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {advantage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Details <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI Assistant Actions</h3>
            <Badge variant="outline">
              {agents.length} Active Agent{agents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid gap-4">
            {actions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Your AI assistant is learning about your preferences. Proactive suggestions will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              actions.map((action) => (
                <Card key={action.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-semibold">{action.action_data.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={action.urgency_level > 3 ? "destructive" : "default"}>
                          Priority {action.urgency_level}
                        </Badge>
                        <Badge variant="outline">
                          {(action.confidence_score * 100).toFixed(0)}% Confident
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {action.action_data.message}
                    </p>

                    {action.action_data.action_items && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Recommended Actions:</p>
                        <ul className="text-sm space-y-1">
                          {action.action_data.action_items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleActionFeedback(action.id, 'positive')}
                        className="flex-1"
                      >
                        Accept & Act
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActionFeedback(action.id, 'negative')}
                        className="flex-1"
                      >
                        Not Interested
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="entanglement" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Skill Entanglement Network</h3>
            <Badge variant="outline">
              {entanglements.length} Entanglement{entanglements.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid gap-4">
            {entanglements.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Skill entanglement network is being constructed. This enables quantum advantages in matching.
                  </p>
                </CardContent>
              </Card>
            ) : (
              entanglements.map((entanglement, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          Skill A ↔ Skill B
                        </span>
                      </div>
                      <Badge 
                        variant={entanglement.entanglement_type === 'synergistic' ? 'default' : 'secondary'}
                      >
                        {entanglement.entanglement_type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Entanglement Strength</span>
                          <span>{(entanglement.entanglement_strength * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={entanglement.entanglement_strength * 100} 
                          className="h-1"
                        />
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Co-occurrence: {(entanglement.correlation_matrix.co_occurrence * 100).toFixed(0)}%</span>
                        <span>Similarity: {(entanglement.correlation_matrix.skill_similarity * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
