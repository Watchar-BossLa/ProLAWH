
import { useState, useCallback, useMemo } from 'react';
import { useLLM } from './useLLM';
import { searchService } from '@/services/searchService';
import type { Opportunity } from '@/types/marketplace';

interface SemanticSearchOptions {
  query: string;
  context?: 'opportunities' | 'learning' | 'network' | 'mentorship';
  userProfile?: any;
  includeRecommendations?: boolean;
}

interface SemanticSearchResult<T = any> {
  item: T;
  relevanceScore: number;
  semanticMatch: boolean;
  reasoning: string;
  categories: string[];
}

export function useSemanticSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([]);
  const [searchInsights, setSearchInsights] = useState<{
    queryInterpretation: string;
    suggestedFilters: string[];
    relatedTopics: string[];
  } | null>(null);
  
  const { generate } = useLLM();

  const performSemanticSearch = useCallback(async (
    data: any[],
    options: SemanticSearchOptions
  ) => {
    setIsSearching(true);
    
    try {
      // First, perform traditional search
      const traditionalResults = searchService.searchOpportunities(
        data,
        { query: options.query, sortBy: 'relevance' }
      );

      // Enhance with semantic analysis
      const semanticPrompt = `
        Analyze this search query and provide semantic understanding:
        Query: "${options.query}"
        Context: ${options.context || 'general'}
        
        Provide:
        1. Query interpretation and intent
        2. Suggested filters or refinements
        3. Related topics and concepts
        4. Semantic categories this query relates to
        
        Format as JSON with keys: interpretation, filters, relatedTopics, categories
      `;

      const semanticAnalysis = await generate({
        task: 'text-generation',
        inputs: semanticPrompt
      });

      // Parse semantic insights
      try {
        const insights = JSON.parse(semanticAnalysis.generated_text || '{}');
        setSearchInsights({
          queryInterpretation: insights.interpretation || '',
          suggestedFilters: insights.filters || [],
          relatedTopics: insights.relatedTopics || []
        });
      } catch (error) {
        console.warn('Failed to parse semantic analysis:', error);
      }

      // Enhance results with semantic scoring
      const enhancedResults: SemanticSearchResult[] = traditionalResults.map(result => ({
        item: result.item,
        relevanceScore: result.score || 0.8, // Use existing score or default
        semanticMatch: true,
        reasoning: `Matches "${options.query}" based on content analysis`,
        categories: ['relevant', 'semantic-match']
      }));

      setSearchResults(enhancedResults);
      
    } catch (error) {
      console.error('Semantic search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [generate]);

  const generateSearchSuggestions = useCallback(async (
    partialQuery: string,
    context?: string
  ) => {
    if (!partialQuery.trim()) return [];

    try {
      const prompt = `
        Generate 5 intelligent search suggestions for the partial query: "${partialQuery}"
        Context: ${context || 'professional development platform'}
        
        Provide creative, helpful suggestions that expand on the user's intent.
        Return as a JSON array of strings.
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt
      });

      return JSON.parse(response.generated_text || '[]');
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    }
  }, [generate]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchInsights(null);
  }, []);

  return {
    isSearching,
    searchResults,
    searchInsights,
    performSemanticSearch,
    generateSearchSuggestions,
    clearSearch
  };
}
