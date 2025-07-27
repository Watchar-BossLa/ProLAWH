
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { 
  Phone,
  Video,
  Search,
  MoreVertical
} from 'lucide-react';

interface ChatHeaderProps {
  connectionName: string;
  connectionAvatar?: string;
  isConnected: boolean;
  showSearch: boolean;
  onToggleSearch: () => void;
  onClose?: () => void;
}

export function ChatHeader({
  connectionName,
  connectionAvatar,
  isConnected,
  showSearch,
  onToggleSearch,
  onClose
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={connectionAvatar} />
          <AvatarFallback>
            {connectionName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{connectionName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSearch}
          className={showSearch ? 'bg-muted' : ''}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        )}
      </div>
    </div>
  );
}
