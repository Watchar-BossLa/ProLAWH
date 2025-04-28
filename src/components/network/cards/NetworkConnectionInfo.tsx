
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkConnection } from "@/types/network";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface NetworkConnectionInfoProps {
  connection: NetworkConnection;
  showMentorshipBadge?: boolean;
}

export function NetworkConnectionInfo({ connection, showMentorshipBadge }: NetworkConnectionInfoProps) {
  const initials = connection.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-row items-center gap-4">
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
          {showMentorshipBadge && connection.mentorship && (
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
    </div>
  );
}
