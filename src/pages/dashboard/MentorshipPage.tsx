import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Star, MessageCircle, Calendar, Users, TrendingUp } from "lucide-react";

export default function MentorshipPage() {
  const mentors = [
    {
      name: "Sarah Johnson",
      role: "Senior React Developer",
      company: "Tech Corp",
      rating: 4.9,
      sessions: 150,
      specialties: ["React", "TypeScript", "System Design"],
      image: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Full Stack Engineer",
      company: "StartupXYZ",
      rating: 4.8,
      sessions: 89,
      specialties: ["Node.js", "Python", "DevOps"],
      image: "MC"
    },
    {
      name: "Emma Davis",
      role: "UX Designer",
      company: "Design Studio",
      rating: 5.0,
      sessions: 67,
      specialties: ["Design Systems", "User Research", "Prototyping"],
      image: "ED"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mentorship</h1>
          <p className="text-muted-foreground mt-1">Connect with experienced professionals to accelerate your career growth.</p>
        </div>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" />
          Become a Mentor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">1,248</p>
                <p className="text-xs text-muted-foreground">Available Mentors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Mentors */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Featured Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {mentor.image}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.role}</p>
                    <p className="text-xs text-muted-foreground">{mentor.company}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mentor.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{mentor.sessions} sessions</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}