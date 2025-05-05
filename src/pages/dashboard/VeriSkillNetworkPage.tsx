
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, Handshake, Shield, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VeriSkillOverview } from "@/components/veriskill/VeriSkillOverview";
import { VeriSkillEmbed } from "@/components/veriskill/VeriSkillEmbed";
import { useNavigate } from "react-router-dom";

// Development flag to bypass authentication
const BYPASS_AUTH = true;

const VeriSkillNetworkPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate connection to VeriSkill platform
    const timer = setTimeout(() => {
      setConnectionStatus(BYPASS_AUTH || user ? 'connected' : 'error');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleSignIn = () => {
    navigate('/auth', { state: { returnUrl: '/dashboard/veriskill' } });
  };

  // During development, bypass authentication check
  if (!BYPASS_AUTH && !user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardTitle className="text-2xl">VeriSkill Network</CardTitle>
            <CardDescription className="text-blue-100">
              Decentralized skill passport, gig matching, and stablecoin payments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="bg-blue-100 p-6 rounded-full">
                <Wallet className="h-16 w-16 text-blue-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Please sign in to access the VeriSkill Network platform. Your secure digital wallet
                  and credentials can only be accessed through an authenticated session.
                </p>
                
                <Button onClick={handleSignIn} size="lg" className="gap-2">
                  <LogIn className="h-4 w-4" /> Sign In to Access VeriSkill
                </Button>
              </div>
              
              <div className="mt-4 w-full max-w-xl pt-8 border-t">
                <h3 className="font-medium mb-2">What is VeriSkill Network?</h3>
                <p className="text-sm text-muted-foreground">
                  VeriSkill Network is a decentralized platform that securely stores your verified credentials,
                  connects you with gig opportunities matching your skills, and enables stablecoin payments
                  across borders with minimal fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <VeriSkillEmbed userId={user?.id || 'development-user'} />
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
