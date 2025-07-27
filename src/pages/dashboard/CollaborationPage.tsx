import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Calendar, Video, FileText, Plus, Activity } from "lucide-react";

export default function CollaborationPage() {
  const collaborations = [
    {
      name: "React Study Group",
      type: "Study Group",
      members: 12,
      lastActivity: "2 hours ago",
      status: "Active",
      topic: "Advanced React Patterns"
    },
    {
      name: "Full Stack Project",
      type: "Team Project",
      members: 5,
      lastActivity: "1 day ago",
      status: "In Progress",
      topic: "E-commerce Platform"
    },
    {
      name: "JavaScript Mentorship",
      type: "Mentorship Circle",
      members: 8,
      lastActivity: "3 hours ago",
      status: "Active",
      topic: "Code Reviews & Best Practices"
    }
  ];

  const upcomingMeetings = [
    {
      title: "Weekly Study Session",
      time: "Today, 2:00 PM",
      group: "React Study Group",
      type: "Video Call"
    },
    {
      title: "Project Review",
      time: "Tomorrow, 10:00 AM",
      group: "Full Stack Project",
      type: "Screen Share"
    },
    {
      title: "Code Review Session",
      time: "Friday, 3:00 PM",
      group: "JavaScript Mentorship",
      type: "Collaborative Coding"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social & Collaboration</h1>
          <p className="text-muted-foreground mt-1">Connect, collaborate, and learn together with your peers.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-xs text-muted-foreground">Active Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">189</p>
                <p className="text-xs text-muted-foreground">Messages Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Video Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Shared Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Collaborations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Collaborations</h2>
          {collaborations.map((collab, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{collab.name}</CardTitle>
                    <CardDescription>{collab.topic}</CardDescription>
                  </div>
                  <Badge variant={collab.status === 'Active' ? 'default' : 'secondary'}>
                    {collab.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{collab.members} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{collab.lastActivity}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
          {upcomingMeetings.map((meeting, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <Badge variant="outline">{meeting.type}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <span>•</span>
                    <span>{meeting.group}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Video className="mr-2 h-4 w-4" />
                      Join Meeting
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}