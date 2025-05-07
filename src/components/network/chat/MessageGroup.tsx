
import { Message } from "@/types/network";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/userUtils";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  contactName: string;
  contactAvatar?: string;
  formatTime: (timestamp: string) => string;
}

export function MessageGroup({
  date,
  messages,
  contactName,
  contactAvatar,
  formatTime
}: MessageGroupProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-center mb-4">
        <Badge variant="outline" className="text-xs font-normal">
          {date}
        </Badge>
      </div>
      
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.sender === 'contact' && (
            <Avatar className="h-8 w-8 mr-2">
              {contactAvatar ? (
                <AvatarImage src={contactAvatar} alt={contactName} />
              ) : (
                <AvatarFallback>
                  {getInitials(contactName)}
                </AvatarFallback>
              )}
            </Avatar>
          )}
          <div 
            className={`max-w-[75%] px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-accent'
            }`}
          >
            <p className="break-words">{message.content}</p>
            <p className={`text-xs mt-1 ${
              message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
          {message.sender === 'user' && (
            <Avatar className="h-8 w-8 ml-2">
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
