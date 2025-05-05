
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Users, Clock, BookOpen, Zap, FileText, Award } from "lucide-react";

export const StudyBeeFeatures: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Learning",
      description: "Leverage advanced AI to generate quizzes, summarize content, and adapt to your learning style.",
      icon: Brain,
      tags: ["AI", "Adaptive Learning"]
    },
    {
      title: "Smart Note-Taking",
      description: "Take notes with automatic organization, tagging, and AI-assisted summarization.",
      icon: FileText,
      tags: ["Notes", "Organization"]
    },
    {
      title: "Collaborative Study Rooms",
      description: "Study together in real-time, share notes, and solve problems collaboratively.",
      icon: Users,
      tags: ["Collaboration", "Group Study"]
    },
    {
      title: "Spaced Repetition",
      description: "System automatically schedules reviews based on proven memory retention techniques.",
      icon: Clock,
      tags: ["Memory", "Retention"]
    },
    {
      title: "Knowledge Graph",
      description: "Visualize connections between concepts to understand relationships and dependencies.",
      icon: Lightbulb,
      tags: ["Visualization", "Connections"]
    },
    {
      title: "Progress Tracking",
      description: "Track your learning journey with detailed analytics and performance metrics.",
      icon: Award,
      tags: ["Analytics", "Progress"]
    },
    {
      title: "Interactive Flashcards",
      description: "Create and study with flashcards enhanced with images, audio, and video.",
      icon: BookOpen,
      tags: ["Flashcards", "Interactive"]
    },
    {
      title: "Quick Focus Sessions",
      description: "Optimized for Pomodoro and other productivity techniques to maximize study efficiency.",
      icon: Zap,
      tags: ["Productivity", "Focus"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </div>
              <CardDescription className="pt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-1 pt-0">
              {feature.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
