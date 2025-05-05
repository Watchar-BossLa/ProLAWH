
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const StudyBeeEmbed: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Bee Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="aspect-video w-full bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold mb-4">Access Your Study Environment</h3>
                <p className="text-muted-foreground mb-6">
                  Study Bee runs in a separate learning environment optimized for focused studying and collaboration.
                  Click the button below to launch Study Bee in a new browser tab.
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
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Last Session</h4>
                <p className="text-sm text-muted-foreground">Advanced Python Programming</p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago • 45 min</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Progress</h4>
                <p className="text-sm text-muted-foreground">12 sessions completed</p>
                <p className="text-xs text-muted-foreground mt-1">3 active courses</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Next Review</h4>
                <p className="text-sm text-muted-foreground">Data Structures Quiz</p>
                <p className="text-xs text-muted-foreground mt-1">Tomorrow • Scheduled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-muted/50 rounded-md">
                <div className="flex justify-between">
                  <span>Algorithms: Quick Sort Implementation</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </li>
              <li className="p-2 hover:bg-muted/50 rounded-md">
                <div className="flex justify-between">
                  <span>Cloud Computing: AWS Services Overview</span>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
              </li>
              <li className="p-2 hover:bg-muted/50 rounded-md">
                <div className="flex justify-between">
                  <span>Machine Learning: Neural Networks</span>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Buddies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-muted/50 rounded-md flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">AK</span>
                </div>
                <span>Alex Kim</span>
                <span className="text-xs text-green-500 ml-auto">Online</span>
              </li>
              <li className="p-2 hover:bg-muted/50 rounded-md flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">JD</span>
                </div>
                <span>Jamie Davis</span>
                <span className="text-xs text-muted-foreground ml-auto">Offline</span>
              </li>
              <li className="p-2 hover:bg-muted/50 rounded-md flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">MP</span>
                </div>
                <span>Morgan Patel</span>
                <span className="text-xs text-amber-500 ml-auto">Away</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
