
import React, { useState } from 'react';
import { ChevronRight, Home, Clock, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSmartBreadcrumbs } from '@/hooks/navigation/useSmartBreadcrumbs';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export function SmartBreadcrumbNavigation() {
  const { isEnabled } = useFeatureFlags();
  const { smartBreadcrumbs, currentPageMetrics } = useSmartBreadcrumbs();
  const [showDetails, setShowDetails] = useState(false);

  // Fallback to basic breadcrumbs if smart navigation is disabled
  if (!isEnabled('smartNavigation') || smartBreadcrumbs.length <= 1) {
    return null;
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 70) return 'text-green-600';
    if (confidence > 40) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {smartBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {crumb.current ? (
                  <div className="flex items-center gap-2">
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    {crumb.isFrequent && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Frequent
                      </Badge>
                    )}
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BreadcrumbLink asChild>
                          <Link 
                            to={crumb.href || '#'}
                            className="flex items-center gap-1 hover:bg-accent rounded px-1 py-0.5 transition-colors"
                            onMouseEnter={() => setShowDetails(true)}
                            onMouseLeave={() => setShowDetails(false)}
                          >
                            {crumb.label}
                            {crumb.confidence && crumb.confidence > 50 && (
                              <div className={`w-2 h-2 rounded-full ${getConfidenceColor(crumb.confidence)} bg-current opacity-60`} />
                            )}
                          </Link>
                        </BreadcrumbLink>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{crumb.label}</div>
                          {crumb.timeSpent && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Total time: {formatTime(crumb.timeSpent)}
                            </div>
                          )}
                          {crumb.confidence && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              Familiarity: {Math.round(crumb.confidence)}%
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Current page insights */}
      {currentPageMetrics && currentPageMetrics.visitCount > 1 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground animate-fade-in-up">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {currentPageMetrics.visitCount} visits
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(currentPageMetrics.timeSpent)} total
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {Math.round(currentPageMetrics.confidence)}% familiarity
          </div>
        </div>
      )}
    </div>
  );
}
