
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

interface VeriSkillEmbedProps {
  userId: string;
}

export function VeriSkillEmbed({ userId }: VeriSkillEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // VeriSkill platform URL - would be configured from environment in production
  const VERISKILL_URL = "https://veriskill.network/embed";
  
  useEffect(() => {
    // Generate an authentication token for secure communication
    // In production, this would be a JWT or similar secure token
    const authToken = `vs_${userId}_${Date.now().toString(36)}`;
    
    const messageHandler = (event: MessageEvent) => {
      // Verify the origin for security
      if (event.origin !== new URL(VERISKILL_URL).origin) return;
      
      const { type, payload } = event.data;
      
      switch (type) {
        case 'VS_LOADED':
          setIsLoading(false);
          break;
        case 'VS_ERROR':
          setIsLoading(false);
          setError(payload.message || 'Unknown error occurred');
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: payload.message || 'Failed to connect to VeriSkill Network'
          });
          break;
        case 'VS_NOTIFICATION':
          toast({
            title: payload.title,
            description: payload.message
          });
          break;
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Simulate iframe loading events
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demonstration purposes, we're not setting an error
      // In production, handle actual connection issues
    }, 2000);
    
    return () => {
      window.removeEventListener('message', messageHandler);
      clearTimeout(timer);
    };
  }, [userId]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = `${VERISKILL_URL}?auth=${encodeURIComponent(
        JSON.stringify({
          userId,
          timestamp: Date.now(),
        })
      )}`;
    }
    
    // Simulate reload completion
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleOpenExternal = () => {
    window.open(`https://veriskill.network/dashboard?userId=${encodeURIComponent(userId)}`, '_blank');
  };

  if (error) {
    return (
      <Card className="w-full p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="text-red-500 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Connection Error</h3>
        <p className="text-muted-foreground text-center mb-4">{error}</p>
        <Button onClick={handleRefresh} className="mb-2">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
        <Button variant="outline" onClick={handleOpenExternal}>
          <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
        </Button>
      </Card>
    );
  }

  return (
    <div className="relative w-full">
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute inset-0 flex items-center justify-center bg-background/80`}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-52" />
          </div>
          <Badge variant="outline" className="animate-pulse">Loading VeriSkill Platform</Badge>
        </div>
      </div>
      
      <div className="flex justify-end mb-2 gap-2">
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
        <Button size="sm" variant="outline" onClick={handleOpenExternal}>
          <ExternalLink className="h-4 w-4 mr-1" /> Open Externally
        </Button>
      </div>
      
      <div className="w-full border rounded-lg overflow-hidden bg-white">
        {/* This iframe would connect to the real VeriSkill platform in production */}
        <iframe 
          ref={iframeRef}
          title="VeriSkill Network"
          src={`${VERISKILL_URL}?auth=${encodeURIComponent(JSON.stringify({userId, timestamp: Date.now()}))}`}
          className="w-full min-h-[800px] border-0"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
}
