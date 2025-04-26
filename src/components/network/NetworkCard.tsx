
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { NetworkConnection } from "@/types/network";
import { MessageCircle, UserRound, BarChart2, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NetworkCardProps {
  connection: NetworkConnection;
  onChatOpen?: (connectionId: string) => void;
}

export function NetworkCard({ connection, onChatOpen }: NetworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const initials = connection.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const statusColors = {
    'online': 'bg-green-500',
    'away': 'bg-amber-500',
    'offline': 'bg-gray-400'
  };

  return (
    <Card 
      className="hover-card glass-card transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {connection.onlineStatus && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusColors[connection.onlineStatus]}`}></div>
          <span className="text-xs text-muted-foreground capitalize">{connection.onlineStatus}</span>
        </div>
      )}
      
      {connection.unreadMessages && connection.unreadMessages > 0 && (
        <div className="absolute top-4 left-4 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
          {connection.unreadMessages}
        </div>
      )}
      
      <CardHeader className="flex flex-row items-center gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="h-16 w-16 border-2 border-primary/20 cursor-pointer">
              {connection.avatar ? (
                <AvatarImage src={connection.avatar} alt={connection.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              )}
              {connection.connectionType === 'mentor' && (
                <div className="absolute bottom-0 right-0 bg-primary text-xs text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                  M
                </div>
              )}
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold">{connection.name}</h3>
              <p className="text-sm">{connection.bio || `Professional at ${connection.company}`}</p>
              {connection.location && (
                <p className="text-xs text-muted-foreground">{connection.location}</p>
              )}
              {connection.skills && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {connection.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {connection.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{connection.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="flex flex-col">
          <h3 className="font-semibold">{connection.name}</h3>
          <p className="text-sm text-muted-foreground">{connection.role}</p>
          <p className="text-xs text-muted-foreground mt-1">{connection.company}</p>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-2">
        <div className="text-sm">
          <span className="font-medium">Connection:</span>{" "}
          <Badge variant="outline" className="capitalize">
            {connection.connectionType}
          </Badge>
        </div>
        
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">Connection Strength</span>
            <span className="text-xs font-medium">{connection.connectionStrength}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${connection.connectionStrength}%` }}
            />
          </div>
        </div>
        
        <div className={`flex gap-2 mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
          <Button 
            size="sm" 
            variant="default" 
            className="flex-1"
            onClick={() => onChatOpen && onChatOpen(connection.id)}
          >
            <MessageCircle size={16} />
            <span className="ml-1">Chat</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate(`/dashboard/network/${connection.id}`)}
          >
            <Users size={16} />
            <span className="ml-1">Profile</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
