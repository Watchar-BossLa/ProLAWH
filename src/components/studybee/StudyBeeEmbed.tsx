
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Clock, BookMarked } from "lucide-react";

export const StudyBeeEmbed: React.FC = () => {
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
                  Study Bee runs in a separate learning environment optimized for focused studying and collaboration.
                  The platform includes advanced note-taking tools, AI-assisted learning, and real-time collaboration features.
                </p>
                
                <Button asChild size="lg" className="gap-2">
                  <a 
                    href="https://www.studybee.info" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Launch Study Bee
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Last Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Advanced Python Programming</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago • 45 min</p>
                  <div className="mt-2 text-xs">
                    <span className="text-primary font-medium">Topics covered: </span>
                    <span className="text-muted-foreground">Decorators, Generators</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">12 sessions completed</p>
                  <p className="text-xs text-muted-foreground mt-1">3 active courses</p>
                  <div className="mt-2 text-xs">
                    <span className="text-primary font-medium">Total study time: </span>
                    <span className="text-muted-foreground">24 hours this month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookMarked className="h-4 w-4 text-primary" />
                    Next Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Data Structures Quiz</p>
                  <p className="text-xs text-muted-foreground mt-1">Tomorrow • Scheduled</p>
                  <div className="mt-2 text-xs">
                    <span className="text-primary font-medium">Material: </span>
                    <span className="text-muted-foreground">Binary Trees, Hash Tables</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
