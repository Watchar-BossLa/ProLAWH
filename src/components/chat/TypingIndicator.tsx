
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  users: string[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((userId) => (
          <Avatar key={userId} className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-xs">
              {userId.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-xs">
          {users.length === 1 
            ? 'is typing' 
            : users.length === 2
              ? 'are typing'
              : `${users.length} people are typing`
          }
        </span>
        
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
