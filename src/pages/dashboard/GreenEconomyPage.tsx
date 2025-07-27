import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Recycle, Wind, Sun, Globe, TrendingUp, Award, Target } from "lucide-react";

export default function GreenEconomyPage() {
  const greenSkills = [
    {
      skill: "Renewable Energy",
      progress: 85,
      level: "Advanced",
      icon: <Sun className="h-5 w-5" />,
      color: "text-yellow-500"
    },
    {
      skill: "Sustainable Design",
      progress: 72,
      level: "Intermediate",
      icon: <Leaf className="h-5 w-5" />,
      color: "text-green-500"
    },
    {
      skill: "Carbon Footprint Analysis",
      progress: 60,
      level: "Intermediate",
      icon: <Globe className="h-5 w-5" />,
      color: "text-blue-500"
    },
    {
      skill: "Circular Economy",
      progress: 45,
      level: "Beginner",
      icon: <Recycle className="h-5 w-5" />,
      color: "text-purple-500"
    }
  ];

  const greenCertifications = [
    {
      name: "Green Technology Specialist",
      issuer: "Sustainable Tech Institute",
      progress: 75,
      estimatedCompletion: "2 months",
      skills: ["Solar Energy", "Wind Power", "Energy Storage"]
    },
    {
      name: "Sustainable Business Practices",
      issuer: "Green Business Council",
      progress: 30,
      estimatedCompletion: "4 months",
      skills: ["ESG Reporting", "Sustainability Metrics", "Green Finance"]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-500" />
            Green Economy
          </h1>
          <p className="text-muted-foreground mt-1">Build skills for a sustainable future and advance the green economy.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Target className="mr-2 h-4 w-4" />
          Set Green Goals
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Green Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
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
                <p className="text-xs text-muted-foreground">Progress Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">2.1T</p>
                <p className="text-xs text-muted-foreground">CO₂ Impact (kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Green Skills Progress */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Green Skills</h2>
          {greenSkills.map((skill, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={skill.color}>
                        {skill.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{skill.skill}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {skill.level}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Green Certifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Green Certifications</h2>
          {greenCertifications.map((cert, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <CardDescription>{cert.issuer}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {cert.estimatedCompletion}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cert.progress}%</span>
                  </div>
                  <Progress value={cert.progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Skills Covered:</p>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 dark:from-green-950/20 dark:to-blue-950/20 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
                Join the Green Revolution
              </h3>
              <p className="text-green-700 dark:text-green-200">
                Develop skills that matter for our planet's future and unlock opportunities in the growing green economy.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Explore Courses
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Start Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}