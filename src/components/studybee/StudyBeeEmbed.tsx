
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookMarked, RefreshCw } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useStudyBeeIntegration } from '@/hooks/useStudyBeeIntegration';

export const StudyBeeEmbed: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, progress } = useStudyBeeIntegration();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateAuthUrl = async () => {
    if (!user) return 'https://www.studybee.info';
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate-studybee-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      
      const data = await response.json();
      return data.studybee_url || 'https://www.studybee.info';
    } catch (error) {
      console.error('Error generating auth URL:', error);
      return 'https://www.studybee.info';
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchStudyBee = async () => {
    const url = await generateAuthUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            Study Bee Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="aspect-video w-full bg-muted/30 rounded-lg flex flex-col items-center justify-center">
              <div className="text-center p-8 max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">Access Your Study Environment</h3>
                <p className="text-muted-foreground mb-6">
                  Study Bee runs as a dedicated platform optimized for focused studying and collaboration.
                  {isConnected ? ' Your account is connected and your progress syncs automatically.' : ' Connect your account to sync progress with ProLawh.'}
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleLaunchStudyBee} 
                    size="lg" 
                    className="gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {isConnected ? 'Continue Studying' : 'Launch Study Bee'}
                  </Button>
                </div>

                {isConnected && (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ✓ Connected & Syncing
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Integration Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookMarked className="h-4 w-4 text-primary" />
                    Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isConnected 
                      ? 'Real-time sync active'
                      : 'Connect to enable sync'
                    }
                  </p>
                </CardContent>
              </Card>
              
              {progress && (
                <>
                  <Card className="bg-muted/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Current Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{progress.current_streak} days</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Keep it going!
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{progress.sessions_this_week} sessions</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(progress.total_study_time / 60)}h total
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
