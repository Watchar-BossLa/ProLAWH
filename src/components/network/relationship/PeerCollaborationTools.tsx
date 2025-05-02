
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { Users, BookOpen, MessageCircle } from "lucide-react";

interface PeerCollaborationToolsProps {
  connection: NetworkConnection;
}

export function PeerCollaborationTools({ connection }: PeerCollaborationToolsProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Study Group</CardTitle>
          <CardDescription>
            Create or join a study group with {connection.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Form Study Group
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Shared Notes</CardTitle>
          <CardDescription>
            Collaborate on study notes and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            Open Shared Notes
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Practice Sessions</CardTitle>
          <CardDescription>
            Schedule practice or review sessions together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Schedule Session
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Knowledge Exchange</CardTitle>
          <CardDescription>
            Exchange skills and knowledge with your peer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Start Exchange
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
