
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { useLLM } from '@/hooks/useLLM';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { NetworkConnection } from '@/types/network';

interface ConnectionSuggestion {
  connectionId: string;
  name: string;
  role: string;
  company: string;
  matchScore: number;
  mutualBenefitScore: number;
  careerGrowthPotential: number;
  suggestedApproach: string;
  introductionTemplate: string;
  sharedInterests: string[];
  strategicValue: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface SmartConnectionSuggestionsProps {
  userProfile: any;
  existingConnections: NetworkConnection[];
  availableConnections: NetworkConnection[];
  onConnect: (connectionId: string) => void;
}

export function SmartConnectionSuggestions({
  userProfile,
  existingConnections,
  availableConnections,
  onConnect
}: SmartConnectionSuggestionsProps) {
  const { isEnabled } = useFeatureFlags();
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ConnectionSuggestion | null>(null);
  const { generate } = useLLM();

  const generateSmartSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
        Analyze this professional network and provide intelligent connection suggestions.
        
        User Profile: ${JSON.stringify(userProfile)}
        
        Existing Connections: ${existingConnections.length} connections
        Available Potential Connections: ${availableConnections.slice(0, 10).map(conn => ({
          id: conn.id,
          name: conn.name,
          role: conn.role,
          company: conn.company,
          skills: conn.skills,
          industry: conn.industry
        }))}
        
        For each potential connection, analyze:
        1. Match score (0-100) based on skills, industry, career level
        2. Mutual benefit potential (0-100)
        3. Career growth potential (0-100) for the user
        4. Strategic value (high/medium/low)
        5. Suggested approach for connection
        6. Personalized introduction template
        7. Shared interests or connection points
        8. Detailed reasoning for the recommendation
        
        Return top 5 suggestions as JSON array matching the ConnectionSuggestion interface.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      const generatedSuggestions = JSON.parse(response.generated_text || '[]');
      
      // Fallback suggestions if AI generation fails
      const fallbackSuggestions: ConnectionSuggestion[] = availableConnections.slice(0, 3).map((conn, index) => ({
        connectionId: conn.id,
        name: conn.name,
        role: conn.role,
        company: conn.company,
        matchScore: 85 - (index * 10),
        mutualBenefitScore: 80 - (index * 5),
        careerGrowthPotential: 90 - (index * 15),
        suggestedApproach: 'Professional introduction focusing on shared interests',
        introductionTemplate: `Hi ${conn.name}, I came across your profile and was impressed by your work in ${conn.industry}. I'd love to connect and share insights about our field.`,
        sharedInterests: conn.skills?.slice(0, 2) || ['Professional Growth'],
        strategicValue: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        reasoning: `Strong match based on ${conn.industry} experience and complementary skills in ${conn.skills?.join(', ')}.`
      }));

      setSuggestions(generatedSuggestions.length > 0 ? generatedSuggestions : fallbackSuggestions);
      
    } catch (error) {
      console.error('Failed to generate smart suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isEnabled('aiConnectionSuggestions') && availableConnections.length > 0) {
      generateSmartSuggestions();
    }
  }, [availableConnections, isEnabled]);

  const getStrategicValueColor = (value: string) => {
    switch (value) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isEnabled('aiConnectionSuggestions')) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Connection Suggestions
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSmartSuggestions}
            disabled={isGenerating}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="h-8 w-8 animate-pulse mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-muted-foreground">
                AI is analyzing your network for strategic connections...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.connectionId}
                className="p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:from-muted/30 hover:to-muted/40 transition-all cursor-pointer"
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{suggestion.name}</h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStrategicValueColor(suggestion.strategicValue)}`}
                      >
                        {suggestion.strategicValue} value
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.role} at {suggestion.company}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Match Score</div>
                        <Progress value={suggestion.matchScore} className="h-2" />
                        <div className="text-xs font-medium mt-1">{suggestion.matchScore}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Mutual Benefit</div>
                        <Progress value={suggestion.mutualBenefitScore} className="h-2" />
                        <div className="text-xs font-medium mt-1">{suggestion.mutualBenefitScore}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Growth Potential</div>
                        <Progress value={suggestion.careerGrowthPotential} className="h-2" />
                        <div className="text-xs font-medium mt-1">{suggestion.careerGrowthPotential}%</div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-blue-600 mb-2">
                      💡 {suggestion.reasoning}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {suggestion.sharedInterests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onConnect(suggestion.connectionId);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSuggestion(suggestion);
                        }}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        View Template
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <TrendingUp className="h-4 w-4 text-green-600 mb-1" />
                    <div className="text-xs text-muted-foreground">Strategic</div>
                  </div>
                </div>
              </div>
            ))}
            
            {suggestions.length === 0 && !isGenerating && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No smart suggestions available. Try expanding your network criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Introduction Template Modal */}
        {selectedSuggestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Introduction Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Approach:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedSuggestion.suggestedApproach}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Introduction Message:</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        {selectedSuggestion.introductionTemplate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSuggestion(null)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedSuggestion.introductionTemplate);
                        setSelectedSuggestion(null);
                      }}
                    >
                      Copy Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
