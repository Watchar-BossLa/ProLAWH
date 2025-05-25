
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Video, Users, FileText, Code, MessageSquare, Calendar } from "lucide-react";
import { SharedWhiteboard } from "./collaboration/SharedWhiteboard";
import { CodeEditor } from "./collaboration/CodeEditor";
import { DocumentCollaboration } from "./collaboration/DocumentCollaboration";
import { VideoCallInterface } from "./collaboration/VideoCallInterface";

export function CollaborationTools() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const activeSessions = [
    {
      id: '1',
      type: 'video',
      title: 'React Study Session',
      participants: 8,
      duration: '45 min',
      status: 'live'
    },
    {
      id: '2',
      type: 'code',
      title: 'Algorithm Practice',
      participants: 5,
      duration: '30 min',
      status: 'live'
    },
    {
      id: '3',
      type: 'whiteboard',
      title: 'System Design Review',
      participants: 12,
      duration: '1h 15m',
      status: 'live'
    }
  ];

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'code': return Code;
      case 'whiteboard': return FileText;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Collaboration Hub</h2>
          <p className="text-muted-foreground">
            Real-time collaboration tools for enhanced learning experiences
          </p>
        </div>
        <Button>
          <Video className="h-4 w-4 mr-2" />
          Start Session
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="video">Video Calls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeSessions.map((session) => {
                    const Icon = getSessionIcon(session.type);
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">{session.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.participants} participants • {session.duration}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {session.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  New Whiteboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  Code Together
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p>Sarah shared a whiteboard in <strong>ML Study Group</strong></p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p>Code review session ended for <strong>React Patterns</strong></p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p>Document collaboration started in <strong>TypeScript Mastery</strong></p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whiteboard">
          <SharedWhiteboard />
        </TabsContent>

        <TabsContent value="code">
          <CodeEditor />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentCollaboration />
        </TabsContent>

        <TabsContent value="video">
          <VideoCallInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}
