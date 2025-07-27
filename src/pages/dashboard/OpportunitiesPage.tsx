import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Filter } from "lucide-react";

export default function OpportunitiesPage() {
  const opportunities = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Node.js"],
      description: "Join our team building next-generation web applications..."
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Contract",
      salary: "$80/hour",
      posted: "1 week ago",
      skills: ["Figma", "User Research", "Prototyping"],
      description: "Design beautiful and intuitive user experiences..."
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100k - $130k",
      posted: "3 days ago",
      skills: ["Python", "React", "AWS"],
      description: "Build scalable systems from the ground up..."
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$110k - $140k",
      posted: "1 day ago",
      skills: ["AWS", "Docker", "Kubernetes"],
      description: "Optimize and maintain cloud infrastructure..."
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Opportunities</h1>
          <p className="text-muted-foreground mt-1">Discover your next career move with AI-matched job opportunities.</p>
        </div>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          Post Opportunity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Applications Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Interviews Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground">Match Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
        <div className="space-y-4">
          {opportunities.map((opportunity, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground mt-1">
                      {opportunity.company}
                    </CardDescription>
                  </div>
                  <Badge variant={opportunity.type === 'Full-time' ? 'default' : 'secondary'}>
                    {opportunity.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{opportunity.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.posted}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {opportunity.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                    <Button size="sm">
                      Apply Now
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