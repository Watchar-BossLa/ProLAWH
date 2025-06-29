
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Users, MessageCircle } from 'lucide-react';
import { ChatRoom } from '@/hooks/chat/types';
import { format } from 'date-fns';

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onCreateChat?: () => void;
  isLoading: boolean;
}

export function ChatRoomList({
  chatRooms,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  isLoading
}: ChatRoomListProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Chat Rooms
            <Button size="sm" onClick={onCreateChat}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chats...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Chat Rooms
          {onCreateChat && (
            <Button size="sm" onClick={onCreateChat}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No chat rooms yet</p>
              {onCreateChat && (
                <Button size="sm" className="mt-2" onClick={onCreateChat}>
                  Start a conversation
                </Button>
              )}
            </div>
          ) : (
            chatRooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedChatId === room.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => onSelectChat(room.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={room.avatar_url} />
                      <AvatarFallback>
                        {room.type === 'direct' ? (
                          <MessageCircle className="h-5 w-5" />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {room.unread_count && room.unread_count > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {room.unread_count > 99 ? '99+' : room.unread_count}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">
                        {room.name || `${room.type} chat`}
                      </h4>
                      {room.updated_at && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(room.updated_at), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    
                    {room.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {room.last_message.content || 
                         (room.last_message.message_type === 'file' ? '📎 File' : 
                          room.last_message.message_type === 'image' ? '🖼️ Image' : 
                          'Message')}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {room.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {room.chat_participants.length} member{room.chat_participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
