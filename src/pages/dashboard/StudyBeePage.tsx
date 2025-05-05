
import React, { useState, useEffect } from 'react';
import { ExternalLink, GraduationCap, Book, BookOpen, NotebookPen, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pageTransitions } from "@/lib/transitions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StudyBeeOverview } from "@/components/studybee/StudyBeeOverview";
import { StudyBeeEmbed } from "@/components/studybee/StudyBeeEmbed";
import { StudyBeeFeatures } from "@/components/studybee/StudyBeeFeatures";
import { StudyBeeRecords } from "@/components/studybee/StudyBeeRecords";

const StudyBeePage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate connection to Study Bee platform
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Study Bee</h1>
            <p className="text-muted-foreground">Your personal study companion</p>
          </div>
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
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <NotebookPen className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Study Records
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            Launch Platform
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <StudyBeeOverview />
        </TabsContent>
        
        <TabsContent value="features" className="pt-6">
          <StudyBeeFeatures />
        </TabsContent>
        
        <TabsContent value="records" className="pt-6">
          <StudyBeeRecords />
        </TabsContent>
        
        <TabsContent value="platform" className="pt-6">
          {connectionStatus === 'connected' ? (
            <StudyBeeEmbed />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Connecting to Study Bee</CardTitle>
                <CardDescription>
                  Please wait while we establish a connection to the Study Bee platform...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center">
                    <Book className="h-16 w-16 text-primary/40" />
                  </div>
                  <p className="mt-4 text-muted-foreground">Establishing secure connection...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyBeePage;
