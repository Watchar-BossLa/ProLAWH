
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckIcon, UserIcon } from "lucide-react";

interface MentorCardProps {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  expertise: string[];
  yearsExperience?: number;
  isAcceptingMentees: boolean;
  onRequestMentorship: (mentorId: string) => void;
}

export function MentorCard({
  id,
  name,
  avatar,
  role,
  company,
  expertise,
  yearsExperience,
  isAcceptingMentees,
  onRequestMentorship,
}: MentorCardProps) {
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-semibold">{name}</h3>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
          {company && <p className="text-xs text-muted-foreground">{company}</p>}
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="text-xs">Mentor</Badge>
            {yearsExperience && (
              <span className="text-xs ml-2 text-muted-foreground">
                {yearsExperience} years experience
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Expertise</p>
            <div className="flex flex-wrap gap-1">
              {expertise.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {isAcceptingMentees ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800">
                <CheckIcon className="h-3 w-3" /> 
                <span>Accepting mentees</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not accepting mentees
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          variant={isAcceptingMentees ? "default" : "outline"}
          disabled={!isAcceptingMentees}
          onClick={() => onRequestMentorship(id)}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Request Mentorship
        </Button>
      </CardFooter>
    </Card>
  );
}
