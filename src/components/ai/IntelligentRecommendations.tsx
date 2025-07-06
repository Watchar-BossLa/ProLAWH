
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, BookOpen, Briefcase, Zap, RefreshCw } from 'lucide-react';
import { useLLM } from '@/hooks/useLLM';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useLocation } from 'react-router-dom';

interface Recommendation {
  id: string;
  type: 'course' | 'connection' | 'opportunity' | 'skill';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  actions: Array<{ label: string; href?: string; action?: () => void }>;
}

interface IntelligentRecommendationsProps {
  userProfile?: any;
  currentContext?: string;
}

export function IntelligentRecommendations({
  userProfile,
  currentContext
}: IntelligentRecommendationsProps) {
  const { isEnabled } = useFeatureFlags();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { generate } = useLLM();

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      const currentPage = location.pathname.split('/').pop() || 'dashboard';
      
      const prompt = `
        Generate intelligent recommendations for a user on a professional development platform.
        
        Current context: ${currentPage}
        User profile: ${JSON.stringify(userProfile || {})}
        
        Generate 6 diverse recommendations across these types:
        - courses: Learning opportunities
        - connections: People to network with
        - opportunities: Job/project opportunities
        - skills: Skills to develop
        
        For each recommendation, provide:
        - type, title, description, reason (why it's recommended)
        - priority (high/medium/low)
        - confidence score (0-100)
        - relevant actions
        
        Return as JSON array matching the Recommendation interface.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      const generated = JSON.parse(response.generated_text || '[]');
      
      // Fallback recommendations if AI generation fails
      const fallbackRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'course',
          title: 'Advanced Sustainable Development',
          description: 'Master the principles of sustainable development and green technology implementation.',
          reason: 'Based on your interest in environmental impact',
          priority: 'high',
          confidence: 90,
          actions: [
            { label: 'Enroll Now', href: '/dashboard/learning' },
            { label: 'Preview', action: () => {} }
          ]
        },
        {
          id: '2',
          type: 'connection',
          title: 'Sarah Chen - ESG Analyst',
          description: 'Senior ESG analyst with 8+ years experience in sustainable finance.',
          reason: 'Complementary expertise in your field',
          priority: 'high',
          confidence: 85,
          actions: [
            { label: 'Connect', href: '/dashboard/network' },
            { label: 'View Profile', action: () => {} }
          ]
        },
        {
          id: '3',
          type: 'opportunity',
          title: 'Green Tech Consultant',
          description: 'Help startups implement sustainable technology solutions.',
          reason: 'Matches your verified skills and interests',
          priority: 'medium',
          confidence: 80,
          actions: [
            { label: 'Apply', href: '/dashboard/opportunities' },
            { label: 'Save', action: () => {} }
          ]
        }
      ];

      setRecommendations(generated.length > 0 ? generated : fallbackRecommendations);
      
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isEnabled('aiEnhancedSearch')) {
      generateRecommendations();
    }
  }, [location.pathname, isEnabled]);

  const filteredRecommendations = recommendations.filter(rec => 
    activeTab === 'all' || rec.type === activeTab
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'connection': return <Users className="h-4 w-4" />;
      case 'opportunity': return <Briefcase className="h-4 w-4" />;
      case 'skill': return <Zap className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isEnabled('aiEnhancedSearch')) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            AI Recommendations
            <Badge variant="secondary">Smart</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="course">Courses</TabsTrigger>
            <TabsTrigger value="connection">Network</TabsTrigger>
            <TabsTrigger value="opportunity">Jobs</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Generating personalized recommendations...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:from-muted/30 hover:to-muted/40 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getTypeIcon(rec.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getPriorityColor(rec.priority)}`}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                          <p className="text-xs text-blue-600 mb-3">
                            💡 {rec.reason}
                          </p>
                          <div className="flex items-center gap-2">
                            {rec.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={index === 0 ? "default" : "outline"}
                                size="sm"
                                onClick={action.action}
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {rec.confidence}% match
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredRecommendations.length === 0 && (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No recommendations available for this category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
