
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Users, Target, Brain, Plus, Calendar } from 'lucide-react';
import { useLLM } from '@/hooks/useLLM';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface ProjectMatch {
  projectId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  duration: string;
  fitScore: number;
  skillMatch: number;
  availabilityMatch: number;
  interestAlignment: number;
  optimalRole: string;
  contributionPotential: string;
  teamComplementarity: number;
}

interface TeamFormationSuggestion {
  projectId: string;
  suggestedTeam: Array<{
    memberId: string;
    name: string;
    role: string;
    skills: string[];
    contributionScore: number;
  }>;
  teamScore: number;
  skillsCoverage: number;
  diversityScore: number;
  collaborationPotential: number;
}

interface ProjectMatchingEngineProps {
  userSkills: string[];
  userInterests: string[];
  availableProjects: any[];
  networkConnections: any[];
}

export function ProjectMatchingEngine({
  userSkills = [],
  userInterests = [],
  availableProjects = [],
  networkConnections = []
}: ProjectMatchingEngineProps) {
  const { isEnabled } = useFeatureFlags();
  const [projectMatches, setProjectMatches] = useState<ProjectMatch[]>([]);
  const [teamSuggestions, setTeamSuggestions] = useState<TeamFormationSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('matches');
  const { generate } = useLLM();

  const analyzeProjectMatches = async () => {
    setIsAnalyzing(true);
    
    try {
      const prompt = `
        Analyze project matches for a user based on their skills and interests.
        
        User Skills: ${userSkills.join(', ')}
        User Interests: ${userInterests.join(', ')}
        
        Available Projects: ${availableProjects.slice(0, 8).map(project => ({
          id: project.id,
          title: project.title || project.name,
          description: project.description,
          skillsNeeded: project.skillsNeeded || project.skills_required || [],
          teamSize: project.teamSize || 3,
          duration: project.duration || '3 months'
        }))}
        
        For each project, calculate:
        1. Overall fit score (0-100)
        2. Skill match percentage (0-100)
        3. Availability match (0-100)
        4. Interest alignment (0-100)
        5. Optimal role for the user
        6. Contribution potential description
        7. Team complementarity score (0-100)
        
        Return top 5 project matches as JSON array matching ProjectMatch interface.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      const generatedMatches = JSON.parse(response.generated_text || '[]');
      
      // Fallback matches if AI generation fails
      const fallbackMatches: ProjectMatch[] = availableProjects.slice(0, 3).map((project, index) => ({
        projectId: project.id || `project-${index}`,
        title: project.title || project.name || `Project ${index + 1}`,
        description: project.description || 'Exciting collaborative opportunity',
        requiredSkills: project.skillsNeeded || project.skills_required || ['Collaboration'],
        teamSize: project.teamSize || 3,
        duration: project.duration || '3 months',
        fitScore: 90 - (index * 15),
        skillMatch: 85 - (index * 10),
        availabilityMatch: 80,
        interestAlignment: 88 - (index * 8),
        optimalRole: index === 0 ? 'Lead Developer' : index === 1 ? 'Technical Contributor' : 'Support Specialist',
        contributionPotential: `Strong potential to contribute ${project.skillsNeeded?.[0] || 'technical'} expertise`,
        teamComplementarity: 85 - (index * 5)
      }));

      setProjectMatches(generatedMatches.length > 0 ? generatedMatches : fallbackMatches);
      
    } catch (error) {
      console.error('Failed to analyze project matches:', error);
      setProjectMatches([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTeamSuggestions = async () => {
    if (projectMatches.length === 0) return;
    
    try {
      const prompt = `
        Generate optimal team formation suggestions for projects.
        
        Top Projects: ${projectMatches.slice(0, 3).map(project => ({
          id: project.projectId,
          title: project.title,
          requiredSkills: project.requiredSkills,
          teamSize: project.teamSize
        }))}
        
        Available Network: ${networkConnections.slice(0, 10).map(conn => ({
          id: conn.id,
          name: conn.name,
          role: conn.role,
          skills: conn.skills || []
        }))}
        
        For each project, suggest optimal team composition including:
        1. Team members from network with complementary skills
        2. Overall team score (0-100)
        3. Skills coverage percentage (0-100)
        4. Team diversity score (0-100)
        5. Collaboration potential (0-100)
        
        Return as JSON array matching TeamFormationSuggestion interface.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      const generatedTeams = JSON.parse(response.generated_text || '[]');
      setTeamSuggestions(generatedTeams);
      
    } catch (error) {
      console.error('Failed to generate team suggestions:', error);
    }
  };

  useEffect(() => {
    if (isEnabled('collaborativeProjects') && availableProjects.length > 0) {
      analyzeProjectMatches();
    }
  }, [availableProjects, userSkills, userInterests, isEnabled]);

  useEffect(() => {
    if (projectMatches.length > 0 && networkConnections.length > 0) {
      generateTeamSuggestions();
    }
  }, [projectMatches, networkConnections]);

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isEnabled('collaborativeProjects')) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-orange-600" />
          Project Matching Engine
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matches">Project Matches</TabsTrigger>
            <TabsTrigger value="teams">Team Formation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matches" className="mt-4">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Brain className="h-8 w-8 animate-pulse mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing project compatibility...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {projectMatches.map((match) => (
                  <div
                    key={match.projectId}
                    className="p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:from-muted/30 hover:to-muted/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{match.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {match.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {match.teamSize} members
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {match.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Overall Fit</div>
                            <div className="flex items-center gap-2">
                              <Progress value={match.fitScore} className="flex-1 h-2" />
                              <span className={`text-sm font-medium ${getFitScoreColor(match.fitScore)}`}>
                                {match.fitScore}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Skill Match</div>
                            <div className="flex items-center gap-2">
                              <Progress value={match.skillMatch} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{match.skillMatch}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs font-medium mb-1">Your Optimal Role:</div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {match.optimalRole}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-green-600 mb-3">
                          💡 {match.contributionPotential}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.requiredSkills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${
                                userSkills.includes(skill) 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : ''
                              }`}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Join Project
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            View Team
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getFitScoreColor(match.fitScore)}`}>
                          {match.fitScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {projectMatches.length === 0 && !isAnalyzing && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No project matches found. Update your skills and interests to get better matches.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="teams" className="mt-4">
            <div className="space-y-4">
              {teamSuggestions.map((suggestion) => (
                <Card key={suggestion.projectId} className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {projectMatches.find(p => p.projectId === suggestion.projectId)?.title || 'Project Team'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{suggestion.teamScore}%</div>
                        <div className="text-xs text-muted-foreground">Team Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{suggestion.skillsCoverage}%</div>
                        <div className="text-xs text-muted-foreground">Skills Coverage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{suggestion.diversityScore}%</div>
                        <div className="text-xs text-muted-foreground">Diversity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{suggestion.collaborationPotential}%</div>
                        <div className="text-xs text-muted-foreground">Collaboration</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {suggestion.suggestedTeam.map((member) => (
                        <div key={member.memberId} className="flex items-center justify-between p-2 rounded border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <Badge variant="outline" className="text-xs">{member.role}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{member.contributionScore}%</div>
                            <div className="text-xs text-muted-foreground">Contribution</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button size="sm" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Form This Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {teamSuggestions.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Team suggestions will appear once you have project matches and network connections.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
