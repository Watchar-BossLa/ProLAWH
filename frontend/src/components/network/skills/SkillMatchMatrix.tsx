
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkConnection } from '@/types/network';
import { Network, Users, Star, BookOpen } from "lucide-react";

interface SkillMatchMatrixProps {
  connections: NetworkConnection[];
  userSkills: string[];
  onSelectConnection: (connectionId: string) => void;
}

export function SkillMatchMatrix({ connections, userSkills, onSelectConnection }: SkillMatchMatrixProps) {
  const [activeTab, setActiveTab] = useState<string>('synergy');
  
  // Get all unique skills
  const allSkills = new Set<string>();
  userSkills.forEach(skill => allSkills.add(skill));
  connections.forEach(connection => {
    connection.skills?.forEach(skill => allSkills.add(skill));
  });
  
  // Calculate skill overlap for each connection
  const connectionMatches = connections.map(connection => {
    const connectionSkills = connection.skills || [];
    
    // Skills that both user and connection have (overlap)
    const sharedSkills = connectionSkills.filter(skill => userSkills.includes(skill));
    
    // Skills that connection has but user doesn't (can learn from)
    const learningOpportunities = connectionSkills.filter(skill => !userSkills.includes(skill));
    
    // Skills that user has but connection doesn't (can teach)
    const teachingOpportunities = userSkills.filter(skill => !connectionSkills.includes(skill));
    
    // Overall compatibility score (0-100)
    const compatibilityScore = Math.round(
      ((sharedSkills.length * 2) + learningOpportunities.length + teachingOpportunities.length) / 
      ((userSkills.length + connectionSkills.length) * 1.5) * 100
    );
    
    return {
      connection,
      sharedSkills,
      learningOpportunities,
      teachingOpportunities,
      compatibilityScore: Math.min(compatibilityScore, 100)
    };
  });
  
  // Sort connections by the active tab metric
  const sortedConnections = [...connectionMatches].sort((a, b) => {
    switch (activeTab) {
      case 'synergy':
        return b.compatibilityScore - a.compatibilityScore;
      case 'shared':
        return b.sharedSkills.length - a.sharedSkills.length;
      case 'learn':
        return b.learningOpportunities.length - a.learningOpportunities.length;
      case 'teach':
        return b.teachingOpportunities.length - a.teachingOpportunities.length;
      default:
        return b.compatibilityScore - a.compatibilityScore;
    }
  });
  
  return (
    <Card className="hover-card glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Network className="h-5 w-5 mr-2 text-primary" />
          Skill Match Matrix
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="synergy" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="synergy">
              <Star className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Overall Synergy</span>
              <span className="sm:hidden">Synergy</span>
            </TabsTrigger>
            <TabsTrigger value="shared">
              <Users className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Shared Skills</span>
              <span className="sm:hidden">Shared</span>
            </TabsTrigger>
            <TabsTrigger value="learn">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Learning From</span>
              <span className="sm:hidden">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="teach">
              <BookOpen className="h-4 w-4 mr-1 transform rotate-180" />
              <span className="hidden sm:inline">Teaching To</span>
              <span className="sm:hidden">Teach</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="max-h-[400px] overflow-y-auto pr-1">
            <div className="space-y-2">
              {sortedConnections.map(({ connection, sharedSkills, learningOpportunities, teachingOpportunities, compatibilityScore }) => (
                <div 
                  key={connection.id} 
                  className="p-3 border rounded-lg bg-background hover:bg-accent/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{connection.name}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {connection.connectionType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.role} at {connection.company}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs font-medium">
                        Match Score: <span className="text-primary">{compatibilityScore}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="mr-1">{sharedSkills.length} shared,</span>
                        <span className="mr-1">{learningOpportunities.length} to learn,</span>
                        <span>{teachingOpportunities.length} to teach</span>
                      </div>
                    </div>
                  </div>
                  
                  <TabsContent value="synergy" className="m-0 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {sharedSkills.length > 0 && (
                        <Badge className="bg-green-500">
                          {sharedSkills.length} shared skills
                        </Badge>
                      )}
                      {learningOpportunities.length > 0 && (
                        <Badge className="bg-blue-500">
                          {learningOpportunities.length} to learn
                        </Badge>
                      )}
                      {teachingOpportunities.length > 0 && (
                        <Badge className="bg-amber-500">
                          {teachingOpportunities.length} to teach
                        </Badge>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shared" className="m-0 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {sharedSkills.length > 0 ? (
                        sharedSkills.map(skill => (
                          <Badge key={skill} variant="default" className="bg-green-500">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No shared skills</span>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="learn" className="m-0 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {learningOpportunities.length > 0 ? (
                        learningOpportunities.map(skill => (
                          <Badge key={skill} variant="default" className="bg-blue-500">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No skills to learn</span>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="teach" className="m-0 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {teachingOpportunities.length > 0 ? (
                        teachingOpportunities.map(skill => (
                          <Badge key={skill} variant="default" className="bg-amber-500">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No skills to teach</span>
                      )}
                    </div>
                  </TabsContent>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onSelectConnection(connection.id)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
