
import React, { useState } from 'react';
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyBeeIntegration } from "@/components/studybee/StudyBeeIntegration";
import { StudyBeeEmbed } from "@/components/studybee/StudyBeeEmbed";
import { StudyBeeSync } from "@/components/studybee/StudyBeeSync";
import { StudyBeeAnalytics } from "@/components/studybee/StudyBeeAnalytics";
import { StudyBeeGoalTracker } from "@/components/studybee/StudyBeeGoalTracker";
import { StudyBeeMessaging } from "@/components/studybee/StudyBeeMessaging";
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

const StudyBeePage: React.FC = () => {
  const [recentSession, setRecentSession] = useState<StudyBeeSession | null>(null);
  const [updatedProgress, setUpdatedProgress] = useState<StudyBeeProgress | null>(null);

  const handleSessionUpdate = (session: StudyBeeSession) => {
    setRecentSession(session);
  };

  const handleProgressUpdate = (progress: StudyBeeProgress) => {
    setUpdatedProgress(progress);
  };

  return (
    <PageWrapper
      title="Study Bee Integration"
      description="Your connected study environment with real-time sync, analytics, and goal tracking"
    >
      {/* Real-time sync component */}
      <StudyBeeSync 
        onSessionUpdate={handleSessionUpdate}
        onProgressUpdate={handleProgressUpdate}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StudyBeeIntegration />
          
          {recentSession && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                Latest session: {recentSession.subject} - {recentSession.duration_minutes} minutes
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="platform">
          <StudyBeeEmbed />
        </TabsContent>

        <TabsContent value="analytics">
          <StudyBeeAnalytics />
        </TabsContent>

        <TabsContent value="goals">
          <StudyBeeGoalTracker />
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Real-time Synchronization</h3>
              <p className="text-muted-foreground">
                Your Study Bee data is automatically synchronized with ProLawh in real-time. 
                This includes study sessions, progress tracking, achievements, and goal updates.
              </p>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Sync Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Study session tracking</li>
                  <li>• Progress and streak updates</li>
                  <li>• Achievement notifications</li>
                  <li>• Goal synchronization</li>
                  <li>• Performance analytics</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cross-Platform Benefits</h3>
              <p className="text-muted-foreground">
                With Study Bee integration, your learning data flows seamlessly between platforms.
              </p>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Integration Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unified learning dashboard</li>
                  <li>• Enhanced progress tracking</li>
                  <li>• Skill verification sync</li>
                  <li>• Mentorship integration</li>
                  <li>• Career path recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Background messaging component */}
      <StudyBeeMessaging />
    </PageWrapper>
  );
};

export default StudyBeePage;
