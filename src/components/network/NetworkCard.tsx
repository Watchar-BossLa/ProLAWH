
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { MessageCircle, UserRound, BarChart2, Users, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MentorshipRequestForm } from "./MentorshipRequestForm";
import { toast } from "@/hooks/use-toast";

interface NetworkCardProps {
  connection: NetworkConnection;
  onChatOpen?: (connectionId: string) => void;
}

export function NetworkCard({ connection, onChatOpen }: NetworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
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
  
  const handleMentorshipRequest = (request: MentorshipRequest) => {
    // In a real app, this would send the request to the backend
    console.log("Mentorship request:", request);
    toast({
      title: "Mentorship Request Sent",
      description: `Your mentorship request has been sent to ${connection.name}.`,
    });
  };
  
  const showMentorshipBadge = connection.connectionType === 'mentor' && 
    connection.mentorship && 
    (connection.mentorship.status === 'active' || connection.mentorship.status === 'pending');

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
              {connection.industry && (
                <p className="text-xs"><span className="font-medium">Industry:</span> {connection.industry}</p>
              )}
              {connection.expertise && connection.expertise.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs font-medium">Expertise:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {connection.expertise.map(item => (
                      <Badge key={item} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{connection.name}</h3>
            {showMentorshipBadge && (
              <Badge variant={connection.mentorship?.status === 'active' ? "default" : "outline"} className="text-xs">
                {connection.mentorship?.status === 'active' ? 'Mentor' : 'Pending Mentor'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{connection.role}</p>
          <p className="text-xs text-muted-foreground mt-1">{connection.company}</p>
          {connection.industry && (
            <p className="text-xs text-muted-foreground mt-1">{connection.industry}</p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-2">
        <div className="text-sm">
          <span className="font-medium">Connection:</span>{" "}
          <Badge variant="outline" className="capitalize">
            {connection.connectionType}
          </Badge>
        </div>
        
        {connection.skills && connection.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {connection.skills.slice(0, 2).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {connection.skills.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{connection.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
        
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
          
          {connection.connectionType === 'peer' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowMentorshipForm(true)}
            >
              <Book size={16} />
              <span className="ml-1">Request Mentor</span>
            </Button>
          )}
          
          {connection.connectionType !== 'peer' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/dashboard/network/${connection.id}`)}
            >
              <Users size={16} />
              <span className="ml-1">Profile</span>
            </Button>
          )}
        </div>
        
        {/* Mentorship Status Section */}
        {connection.mentorship && connection.mentorship.status === 'active' && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-semibold mb-1">Mentorship Focus Areas:</p>
            <div className="flex flex-wrap gap-1">
              {connection.mentorship.focusAreas.slice(0, 2).map((area, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {connection.mentorship.focusAreas.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{connection.mentorship.focusAreas.length - 2}
                </Badge>
              )}
            </div>
            
            {connection.mentorship.nextMeetingDate && (
              <p className="text-xs mt-2">
                <span className="font-medium">Next Meeting:</span> {new Date(connection.mentorship.nextMeetingDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <MentorshipRequestForm
        connection={connection}
        isOpen={showMentorshipForm}
        onClose={() => setShowMentorshipForm(false)}
        onSubmit={handleMentorshipRequest}
      />
    </Card>
  );
}
