
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Book, PenTool, Brain, Users, Star } from "lucide-react";

export const StudyBeeOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            About Study Bee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Study Bee is an AI-powered study companion designed to help you master any subject.
            With personalized learning paths, interactive quizzes, and collaborative study sessions,
            Study Bee transforms how you learn and retain knowledge.
          </p>
          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <p className="text-sm font-medium">
              Study Bee is fully integrated with ProLawh, allowing you to connect your 
              study progress with your career development and skills acquisition.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <PenTool className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Smart note-taking with AI summarization</span>
            </li>
            <li className="flex items-start gap-2">
              <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Adaptive quiz generation based on your learning style</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Collaborative study rooms with real-time sharing</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Performance tracking and progress analytics</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>How to Use Study Bee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-medium mb-1">Sign In</h3>
                <p className="text-sm text-muted-foreground">Use your ProLawh credentials to access Study Bee</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-medium mb-1">Create Study Space</h3>
                <p className="text-sm text-muted-foreground">Set up a personalized learning environment</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-medium mb-1">Start Learning</h3>
                <p className="text-sm text-muted-foreground">Dive into interactive learning sessions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
