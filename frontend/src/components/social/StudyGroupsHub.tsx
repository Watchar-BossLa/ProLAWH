
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Clock, BookOpen, MessageCircle, Calendar } from "lucide-react";
import { StudyGroupCard } from "./study-groups/StudyGroupCard";
import { CreateStudyGroupDialog } from "./study-groups/CreateStudyGroupDialog";
import { StudyGroupRecommendations } from "./study-groups/StudyGroupRecommendations";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting?: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  compatibility_score?: number;
}

export function StudyGroupsHub() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("my-groups");

  // Mock data - in real app this would come from Supabase
  const myGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'React Advanced Patterns',
      description: 'Deep dive into advanced React patterns and performance optimization',
      subject: 'React',
      memberCount: 8,
      maxMembers: 12,
      meetingSchedule: 'Tuesdays 7PM EST',
      nextMeeting: '2024-01-30T19:00:00Z',
      tags: ['hooks', 'performance', 'patterns'],
      isPublic: true,
      createdBy: 'user-1',
      skill_level: 'advanced'
    },
    {
      id: '2',
      name: 'Machine Learning Fundamentals',
      description: 'Learning ML basics together with hands-on projects',
      subject: 'Machine Learning',
      memberCount: 15,
      maxMembers: 20,
      meetingSchedule: 'Saturdays 2PM EST',
      nextMeeting: '2024-02-03T14:00:00Z',
      tags: ['python', 'tensorflow', 'basics'],
      isPublic: true,
      createdBy: 'user-2',
      skill_level: 'beginner'
    }
  ];

  const recommendedGroups: StudyGroup[] = [
    {
      id: '3',
      name: 'TypeScript Mastery',
      description: 'Master TypeScript from basics to advanced features',
      subject: 'TypeScript',
      memberCount: 6,
      maxMembers: 10,
      meetingSchedule: 'Wednesdays 6PM EST',
      tags: ['typescript', 'javascript', 'types'],
      isPublic: true,
      createdBy: 'user-3',
      skill_level: 'intermediate',
      compatibility_score: 95
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Study Groups</h2>
          <p className="text-muted-foreground">
            Connect with peers and learn together through AI-matched study groups
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-groups">
            <Users className="h-4 w-4 mr-2" />
            My Groups ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger value="recommended">
            <BookOpen className="h-4 w-4 mr-2" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="discover">
            <MessageCircle className="h-4 w-4 mr-2" />
            Discover
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <StudyGroupRecommendations groups={recommendedGroups} />
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Discover new study groups based on your interests</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateStudyGroupDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
