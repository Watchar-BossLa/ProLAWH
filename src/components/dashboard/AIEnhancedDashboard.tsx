
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { ContextualAIAssistant } from '@/components/ai/ContextualAIAssistant';
import { IntelligentRecommendations } from '@/components/ai/IntelligentRecommendations';
import { SemanticSearchBar } from '@/components/search/SemanticSearchBar';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export function AIEnhancedDashboard() {
  const { isEnabled } = useFeatureFlags();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // This would integrate with your existing search logic
  };

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  if (!isEnabled('aiEnhancedSearch')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AI-powered features are currently disabled. Enable them in your feature flags to unlock intelligent search, contextual assistance, and personalized recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI-Powered Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI-Powered Platform
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Phase 2 Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Experience intelligent search, contextual assistance, and personalized recommendations powered by advanced AI.
            </p>
            
            <SemanticSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onResultsChange={handleSearchResults}
              placeholder="Search anything with AI understanding..."
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Features Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="assistant">
            <Zap className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-6">
          <IntelligentRecommendations />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semantic Search Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Query Understanding</span>
                    <Badge variant="outline">95% Accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contextual Relevance</span>
                    <Badge variant="outline">88% Match</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recommendation Precision</span>
                    <Badge variant="outline">92% Success</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Semantic Searches</span>
                    <span className="font-medium">247 this week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Recommendations Used</span>
                    <span className="font-medium">156 actions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assistant Interactions</span>
                    <span className="font-medium">89 conversations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contextual AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your AI assistant is available throughout the platform to provide contextual help, suggestions, and guidance. Click the AI button in the bottom right to get started.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Context-Aware</Badge>
                <Badge variant="outline">Conversational</Badge>
                <Badge variant="outline">Proactive Suggestions</Badge>
                <Badge variant="outline">Multi-Modal</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contextual AI Assistant */}
      <ContextualAIAssistant
        isOpen={aiAssistantOpen}
        onToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
      />
    </div>
  );
}
