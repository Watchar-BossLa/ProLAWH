
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, BookIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MentorshipCardProps {
  mentorship: any;
  isMentor: boolean;
  onUpdate: () => void;
}

export function MentorshipCard({ mentorship, isMentor, onUpdate }: MentorshipCardProps) {
  const navigate = useNavigate();
  
  const otherPerson = isMentor ? mentorship.mentee : mentorship.mentor;
  const name = otherPerson?.profiles?.full_name || "User";
  const avatar = otherPerson?.profiles?.avatar_url;
  
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    paused: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    declined: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {isMentor ? "Mentee" : "Mentor"}
            <Badge className={statusColors[mentorship.status] || ""}>
              {mentorship.status.charAt(0).toUpperCase() + mentorship.status.slice(1)}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            {avatar ? (
              <AvatarImage src={avatar} alt={name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {isMentor ? "Your mentee" : "Your mentor"}
            </p>
          </div>
        </div>
        
        {mentorship.focus_areas && mentorship.focus_areas.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Focus Areas:</p>
            <div className="flex flex-wrap gap-1">
              {mentorship.focus_areas.slice(0, 3).map((area: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {(mentorship.focus_areas.length > 3) && (
                <Badge variant="outline" className="text-xs">
                  +{mentorship.focus_areas.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {mentorship.meeting_frequency && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Meets {mentorship.meeting_frequency}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate(`/dashboard/mentorship/${mentorship.id}`)}
        >
          <BookIcon className="h-4 w-4 mr-2" />
          View Details
          <ChevronRightIcon className="h-4 w-4 ml-auto" />
        </Button>
      </CardFooter>
    </Card>
  );
}
