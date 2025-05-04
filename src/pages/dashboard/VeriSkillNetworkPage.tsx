
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, Handshake, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VeriSkillOverview } from "@/components/veriskill/VeriSkillOverview";
import { VeriSkillEmbed } from "@/components/veriskill/VeriSkillEmbed";

const VeriSkillNetworkPage: React.FC = () => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate connection to VeriSkill platform
    const timer = setTimeout(() => {
      setConnectionStatus(user ? 'connected' : 'error');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to access the VeriSkill Network platform.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">VeriSkill Network</h1>
            <p className="text-muted-foreground">
              Decentralized skill passport, gig matching, and stablecoin payments
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-amber-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Connection Error'}
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="platform">VeriSkill Platform</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-6">
            <VeriSkillOverview />
          </TabsContent>
          
          <TabsContent value="platform" className="pt-6">
            {connectionStatus === 'connected' ? (
              <VeriSkillEmbed userId={user.id} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Connecting to VeriSkill Network</CardTitle>
                  <CardDescription>
                    Please wait while we establish a connection to the VeriSkill platform...
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="h-16 w-16 text-primary/40" />
                    </div>
                    <p className="mt-4 text-muted-foreground">Establishing secure connection...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VeriSkillNetworkPage;
