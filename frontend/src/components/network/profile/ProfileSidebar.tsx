
import { NetworkConnection } from "@/types/network";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Book, MessageCircle } from "lucide-react";
import { NetworkConnectionStrength } from "../cards/NetworkConnectionStrength";

interface ProfileSidebarProps {
  connection: NetworkConnection;
  isPendingMentor: boolean;
  onOpenChat: () => void;
  onOpenMentorshipForm: () => void;
}

export function ProfileSidebar({ 
  connection, 
  isPendingMentor, 
  onOpenChat, 
  onOpenMentorshipForm 
}: ProfileSidebarProps) {
  const isMentor = connection.connectionType === 'mentor';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback className="text-2xl">
                {connection.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-xl font-semibold text-center">{connection.name}</h2>
          <p className="text-sm text-muted-foreground text-center">
            {connection.role} at {connection.company}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center mb-2 gap-2">
            <Badge className="capitalize">{connection.connectionType}</Badge>
            {connection.onlineStatus && (
              <Badge variant="outline" className="capitalize">{connection.onlineStatus}</Badge>
            )}
          </div>
          
          {connection.bio && (
            <div className="py-2">
              <p className="text-sm text-muted-foreground">{connection.bio}</p>
            </div>
          )}
          
          <div className="border-t border-border my-2" />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {connection.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {connection.location && (
            <div>
              <h4 className="text-sm font-medium mb-2">Location</h4>
              <p className="text-sm">{connection.location}</p>
            </div>
          )}
          
          {connection.industry && (
            <div>
              <h4 className="text-sm font-medium mb-2">Industry</h4>
              <Badge variant="outline">{connection.industry}</Badge>
            </div>
          )}
          
          {connection.expertise && connection.expertise.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {connection.expertise.map((item) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <NetworkConnectionStrength connection={connection} />
          
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1" 
              onClick={onOpenChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            
            {!isMentor && !isPendingMentor && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onOpenMentorshipForm}
              >
                <Book className="h-4 w-4 mr-2" />
                Request Mentor
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
