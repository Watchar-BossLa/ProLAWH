
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

interface TopicSuggestionsProps {
  topics: string[];
  isGenerating: boolean;
  onSelectTopic: (topic: string) => void;
}

export function TopicSuggestions({
  topics,
  isGenerating,
  onSelectTopic
}: TopicSuggestionsProps) {
  if (topics.length === 0 && !isGenerating) {
    return null;
  }

  return (
    <div className="p-3 border-t">
      <div className="flex items-center mb-2">
        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
        <span className="text-xs font-medium">Suggested conversation starters:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="cursor-pointer text-xs py-1 hover:bg-secondary/80"
            onClick={() => onSelectTopic(topic)}
          >
            {topic}
          </Badge>
        ))}
        {isGenerating && (
          <Badge variant="outline" className="text-xs animate-pulse">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Generating...
          </Badge>
        )}
      </div>
    </div>
  );
}
