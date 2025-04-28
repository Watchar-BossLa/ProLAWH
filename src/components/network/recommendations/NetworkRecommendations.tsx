
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { NetworkRecommendation } from '@/hooks/useNetworkRecommendations';
import { NetworkConnection } from '@/types/network';
import { Brain, ZapIcon, Users, Share2, Rocket, Lightbulb } from "lucide-react";

interface NetworkRecommendationsProps {
  recommendations: NetworkRecommendation[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectConnection: (connectionId: string) => void;
  connections: NetworkConnection[];
  insights: string;
}

export function NetworkRecommendations({
  recommendations,
  isLoading,
  onRefresh,
  onSelectConnection,
  connections,
  insights
}: NetworkRecommendationsProps) {
  
  // Find connection details from the ID
  const getConnectionDetails = (connectionId: string) => {
    return connections.find(c => c.id === connectionId);
  };
  
  return (
    <Card className="hover-card glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          AI Connection Recommendations
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <ZapIcon className="h-4 w-4 mr-2" />
          {isLoading ? 'Analyzing...' : 'Analyze Network'}
        </Button>
      </CardHeader>
      
      <CardContent className="pt-3">
        {recommendations.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Click "Analyze Network" to get AI-powered connection recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights && (
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-sm flex">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>{insights}</span>
                </p>
              </div>
            )}
            
            {recommendations.map((recommendation) => {
              const connection = getConnectionDetails(recommendation.connectionId);
              if (!connection) return null;
              
              return (
                <Card key={recommendation.connectionId} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{connection.name}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {connection.connectionType}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-2">Match score:</span>
                        <Progress 
                          value={recommendation.matchScore} 
                          className="w-20 h-2" 
                        />
                        <span className="text-xs font-medium ml-2">
                          {recommendation.matchScore}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {recommendation.reason}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium mb-1 flex items-center">
                          <Rocket className="h-3 w-3 mr-1" />
                          Potential collaborations:
                        </p>
                        <ul className="text-xs text-muted-foreground list-disc pl-5">
                          {recommendation.potentialProjects.map((project, idx) => (
                            <li key={idx}>{project}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => onSelectConnection(recommendation.connectionId)}
                        className="gap-1"
                      >
                        <Share2 className="h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
