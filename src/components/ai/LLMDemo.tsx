
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLLM } from '@/hooks/useLLM';
import { toast } from 'sonner';

export function LLMDemo() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const { generate, isLoading, error } = useLLM();

  const handleSubmit = async () => {
    try {
      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });
      setResult(response.generated_text);
    } catch (err) {
      toast.error('Failed to generate response');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Text Generation Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
        {error && (
          <p className="text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
