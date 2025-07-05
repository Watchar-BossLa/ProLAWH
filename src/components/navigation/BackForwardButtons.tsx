
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigation } from './NavigationProvider';

export function BackForwardButtons() {
  const { canGoBack, canGoForward, goBack, goForward, history, currentPath } = useNavigation();

  const getCurrentIndex = () => {
    return history.findIndex(item => item.path === currentPath);
  };

  const getPreviousPage = () => {
    const currentIndex = getCurrentIndex();
    return currentIndex < history.length - 1 ? history[currentIndex + 1] : null;
  };

  const getNextPage = () => {
    const currentIndex = getCurrentIndex();
    return currentIndex > 0 ? history[currentIndex - 1] : null;
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            disabled={!canGoBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {canGoBack ? `Back to ${getPreviousPage()?.title}` : 'No previous page'}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={goForward}
            disabled={!canGoForward}
            className="h-8 w-8"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {canGoForward ? `Forward to ${getNextPage()?.title}` : 'No next page'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
