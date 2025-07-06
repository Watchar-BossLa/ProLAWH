
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Sparkles, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { useLLM } from '@/hooks/useLLM';
import { useLocation } from 'react-router-dom';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface AIMessage {
  id: string;
  type: 'assistant' | 'user' | 'suggestion';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: () => void }>;
}

interface ContextualAIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  userContext?: any;
}

export function ContextualAIAssistant({ 
  isOpen, 
  onToggle, 
  userContext 
}: ContextualAIAssistantProps) {
  const { isEnabled } = useFeatureFlags();
  const location = useLocation();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const { generate, isLoading } = useLLM();

  // Generate contextual suggestions based on current page
  const generateContextualSuggestions = async () => {
    const currentPath = location.pathname;
    const pageContext = currentPath.split('/').pop()?.replace('-', ' ') || 'dashboard';
    
    try {
      const prompt = `
        User is on the ${pageContext} page of a professional development platform.
        Generate 3 helpful, contextual suggestions for what they might want to do next.
        
        Keep suggestions specific, actionable, and relevant to their current context.
        Format as JSON array with objects containing 'text' and 'action' keys.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      const suggestions = JSON.parse(response.generated_text || '[]');
      
      const suggestionMessages: AIMessage[] = suggestions.map((suggestion: any, index: number) => ({
        id: `suggestion-${Date.now()}-${index}`,
        type: 'suggestion' as const,
        content: suggestion.text,
        timestamp: new Date(),
        actions: suggestion.action ? [{ 
          label: 'Take Action', 
          action: () => console.log('Action:', suggestion.action) 
        }] : undefined
      }));

      setMessages(prev => [...prev, ...suggestionMessages]);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  // Initialize with contextual suggestions
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateContextualSuggestions();
    }
  }, [isOpen, location.pathname]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const contextPrompt = `
        User is asking: "${inputValue}"
        
        They are currently on: ${location.pathname}
        Context: Professional development platform
        
        Provide a helpful, concise response that addresses their question.
        Include actionable advice when possible.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: contextPrompt
      });

      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.generated_text || 'I apologize, but I cannot provide a response right now.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  if (!isEnabled('aiEnhancedSearch')) {
    return null;
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg"
        size="icon"
      >
        <Brain className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 shadow-xl transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-96'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI Assistant
            <Badge variant="secondary" className="text-xs">
              Context-Aware
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggle}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="flex flex-col h-full">
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : message.type === 'suggestion'
                      ? 'bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                      : 'bg-muted mr-4'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  {message.actions && (
                    <div className="mt-2 flex gap-2">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
