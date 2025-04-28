
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLLM } from '@/hooks/useLLM';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function LLMDemo() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { generate, isLoading } = useLLM();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');

    try {
      const response = await generate({
        task: 'text-generation',
        inputs: `You are a helpful AI assistant. Respond to this message: ${prompt}`,
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.generated_text || 'I apologize, but I was unable to generate a response.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      toast.error('Failed to generate response. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Chat Assistant (Mixtral-8x7B)</CardTitle>
        <CardDescription>
          Powered by one of the most capable open-source language models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-muted rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="self-end"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
