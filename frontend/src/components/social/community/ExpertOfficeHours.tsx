
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Star, Video, MessageSquare } from "lucide-react";

export function ExpertOfficeHours() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const officeHours = [
    {
      id: '1',
      expert: {
        name: 'Dr. Sarah Chen',
        title: 'Senior React Engineer at Meta',
        avatar: 'SC',
        rating: 4.9,
        expertise: ['React', 'TypeScript', 'Performance']
      },
      topic: 'Advanced React Patterns & Performance Optimization',
      date: '2024-01-30',
      time: '2:00 PM EST',
      duration: 60,
      spotsAvailable: 8,
      totalSpots: 15,
      price: 'Free',
      format: 'Q&A + Live Coding',
      description: 'Deep dive into advanced React patterns, performance optimization techniques, and best practices for large-scale applications.'
    },
    {
      id: '2',
      expert: {
        name: 'Alex Rodriguez',
        title: 'ML Engineering Lead at OpenAI',
        avatar: 'AR',
        rating: 4.8,
        expertise: ['Machine Learning', 'Python', 'AI Systems']
      },
      topic: 'Getting Started with Machine Learning',
      date: '2024-02-01',
      time: '7:00 PM EST',
      duration: 90,
      spotsAvailable: 12,
      totalSpots: 20,
      price: 'Free',
      format: 'Workshop + Hands-on',
      description: 'Perfect for beginners looking to understand ML fundamentals and start their journey in artificial intelligence.'
    },
    {
      id: '3',
      expert: {
        name: 'Michael Kim',
        title: 'Principal Engineer at Netflix',
        avatar: 'MK',
        rating: 4.9,
        expertise: ['System Design', 'Scalability', 'Architecture']
      },
      topic: 'System Design for Senior Engineers',
      date: '2024-02-03',
      time: '1:00 PM EST',
      duration: 120,
      spotsAvailable: 5,
      totalSpots: 10,
      price: '$25',
      format: 'Interactive Design Session',
      description: 'Advanced system design concepts and real-world case studies from Netflix scale systems.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics', count: officeHours.length },
    { id: 'frontend', label: 'Frontend', count: 1 },
    { id: 'backend', label: 'Backend', count: 1 },
    { id: 'ml-ai', label: 'ML & AI', count: 1 },
    { id: 'career', label: 'Career', count: 0 }
  ];

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return 'text-green-600';
    if (ratio > 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Expert Office Hours</h3>
          <p className="text-sm text-muted-foreground">
            Learn from industry experts in small group sessions
          </p>
        </div>
        <Button>Host Office Hours</Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Office Hours List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {officeHours.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{session.expert.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{session.expert.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{session.expert.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.expert.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.expert.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium">{session.topic}</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  {session.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{session.time} ({session.duration}min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className={getAvailabilityColor(session.spotsAvailable, session.totalSpots)}>
                    {session.spotsAvailable}/{session.totalSpots} spots
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>{session.format}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Badge className={session.price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {session.price}
                  </Badge>
                  {session.spotsAvailable < 5 && (
                    <Badge variant="destructive" className="text-xs">
                      Almost Full
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Ask Question
                  </Button>
                  <Button size="sm" disabled={session.spotsAvailable === 0}>
                    {session.spotsAvailable === 0 ? 'Full' : 'Join Session'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Sessions Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Want to host your own office hours?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Share your expertise with the community and earn recognition as a subject matter expert.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Become an Expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
