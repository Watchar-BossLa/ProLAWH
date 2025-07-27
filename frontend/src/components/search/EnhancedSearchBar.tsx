
import React, { useState } from 'react';
import { AdvancedSearchBar } from './AdvancedSearchBar';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Search, Sparkles } from 'lucide-react';

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  className?: string;
}

export function EnhancedSearchBar(props: EnhancedSearchBarProps) {
  const { isEnabled } = useFeatureFlags();
  const [aiSuggestionMode, setAiSuggestionMode] = useState(false);

  // If enhanced UI is disabled, fall back to original component
  if (!isEnabled('enhancedUI')) {
    return <AdvancedSearchBar {...props} />;
  }

  return (
    <div className="space-y-4">
      <EnhancedCard variant="glass" className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdvancedSearchBar {...props} />
          </div>
          
          {isEnabled('aiEnhancedSearch') && (
            <EnhancedButton
              enhancement="gradient"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={() => setAiSuggestionMode(!aiSuggestionMode)}
              className="shrink-0"
            >
              AI Boost
            </EnhancedButton>
          )}
        </div>

        {aiSuggestionMode && isEnabled('aiEnhancedSearch') && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg animate-fade-in-up">
            <p className="text-sm text-muted-foreground mb-2">AI-powered suggestions based on your profile:</p>
            <div className="flex flex-wrap gap-2">
              {['Sustainable Architecture', 'Green Energy Consulting', 'ESG Analysis'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => props.onChange(suggestion)}
                  className="px-3 py-1 bg-white/60 hover:bg-white/80 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </EnhancedCard>
    </div>
  );
}
