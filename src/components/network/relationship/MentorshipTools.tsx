
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { BookOpen, Calendar, MessageCircle } from "lucide-react";

interface MentorshipToolsProps {
  connection: NetworkConnection;
}

export function MentorshipTools({ connection }: MentorshipToolsProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Mentorship Session</CardTitle>
          <CardDescription>
            Schedule a mentorship session with {connection.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Goal Setting</CardTitle>
          <CardDescription>
            Set and track goals with your mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            Manage Goals
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Structured Learning</CardTitle>
          <CardDescription>
            Access structured learning resources shared by your mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            View Resources
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Session Prep</CardTitle>
          <CardDescription>
            Prepare questions for your next mentorship session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Create Agenda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
