
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shuffle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  compatibilityScore: number;
}

interface ProjectInfo {
  title: string;
  description: string;
  requiredSkills: string[];
}

interface TeamFormationSimulatorProps {
  selectedProject: ProjectInfo;
}

export function TeamFormationSimulator({ selectedProject }: TeamFormationSimulatorProps) {
  const [suggestedTeam, setSuggestedTeam] = useState<TeamMember[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock potential team members
  const mockTeamMembers: TeamMember[] = [
    { 
      id: "1", 
      name: "Morgan Hayes", 
      avatar: "", 
      role: "Solar Energy Expert",
      skills: ["Solar Panel Installation", "Energy Efficiency", "Project Management"],
      compatibilityScore: 92
    },
    { 
      id: "2", 
      name: "Casey Richards", 
      avatar: "", 
      role: "Sustainability Analyst",
      skills: ["Carbon Accounting", "Environmental Assessment", "Data Analysis"],
      compatibilityScore: 88
    },
    { 
      id: "3", 
      name: "Taylor Kim", 
      avatar: "", 
      role: "Community Organizer",
      skills: ["Stakeholder Engagement", "Public Relations", "Event Planning"],
      compatibilityScore: 85
    },
    { 
      id: "4", 
      name: "Jordan Smith", 
      avatar: "", 
      role: "Green Building Designer",
      skills: ["Architectural Design", "LEED Certification", "3D Modeling"],
      compatibilityScore: 79
    }
  ];
  
  const handleGenerateTeam = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSuggestedTeam(mockTeamMembers);
      setIsGenerating(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" />
          AI Team Formation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium">Selected Project</h3>
          <p className="text-sm text-muted-foreground">{selectedProject.title}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedProject.requiredSkills.map((skill, idx) => (
              <Badge key={idx} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateTeam} 
          className="w-full mb-4"
          disabled={isGenerating}
        >
          {isGenerating ? 'Finding Optimal Team...' : 'Generate Optimal Team'}
        </Button>
        
        {suggestedTeam.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Suggested Team Members</h3>
            <div className="space-y-3">
              {suggestedTeam.map((member) => (
                <div key={member.id} className="flex items-center justify-between border rounded-lg p-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      {member.avatar && <AvatarImage src={member.avatar} />}
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {member.compatibilityScore}%
                          </Badge>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="space-y-2 p-1">
                          <div className="font-medium">Relevant Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
