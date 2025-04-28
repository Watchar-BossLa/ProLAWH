
import { useState } from 'react';
import { useLLM } from '@/hooks/useLLM';
import { NetworkConnection } from '@/types/network';
import { toast } from 'sonner';

export interface NetworkRecommendation {
  connectionId: string;
  reason: string;
  matchScore: number;
  skills: string[];
  potentialProjects: string[];
}

export interface RecommendationResponse {
  recommendations: NetworkRecommendation[];
  insights: string;
}

export function useNetworkRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<NetworkRecommendation[]>([]);
  const [insights, setInsights] = useState<string>('');
  const { generate } = useLLM();

  const getRecommendations = async (userSkills: string[], connections: NetworkConnection[]) => {
    setIsLoading(true);
    try {
      const prompt = `
        As an AI Career Twin, analyze this network data and provide personalized connection recommendations.
        
        User skills: ${userSkills.join(', ')}
        
        Available connections in the network:
        ${connections.map(c => `
          ID: ${c.id}
          Name: ${c.name}
          Role: ${c.role}
          Company: ${c.company}
          Skills: ${c.skills?.join(', ') || 'None listed'}
          Connection type: ${c.connectionType}
          Industry: ${c.industry || 'Unknown'}
        `).join('\n')}
        
        Provide the following:
        1. Top 3 recommended connections with their IDs from the list above
        2. For each connection, include: reason for recommendation, match score (0-100), and potential collaboration areas
        3. Brief insight about the user's network and how it could be improved
        
        Format your response as JSON with this structure:
        {
          "recommendations": [
            {
              "connectionId": "id-here",
              "reason": "text explaining the recommendation",
              "matchScore": number,
              "skills": ["relevant skill 1", "relevant skill 2"],
              "potentialProjects": ["project idea 1", "project idea 2"]
            }
          ],
          "insights": "text with network insights"
        }
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt,
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      });

      if (!response || !response.generated_text) {
        throw new Error('Failed to generate recommendations');
      }

      // Extract JSON from the response
      const jsonMatch = response.generated_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsedResponse: RecommendationResponse = JSON.parse(jsonMatch[0]);
      
      setRecommendations(parsedResponse.recommendations);
      setInsights(parsedResponse.insights);
      return parsedResponse;

    } catch (err) {
      console.error('Error generating network recommendations:', err);
      toast.error('Failed to generate network recommendations');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getRecommendations,
    recommendations,
    insights,
    isLoading
  };
}
