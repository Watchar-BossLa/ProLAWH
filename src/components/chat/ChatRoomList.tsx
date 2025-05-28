
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";
import { ChatRoom } from "@/hooks/useRealTimeChat";
import { format } from "date-fns";

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  isLoading?: boolean;
}

export function ChatRoomList({ chatRooms, selectedChatId, onSelectChat, isLoading }: ChatRoomListProps) {
  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chats
          <Badge variant="secondary">{chatRooms.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No chat rooms yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    selectedChatId === room.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => onSelectChat(room.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {room.type === 'group' ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          room.name.charAt(0).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{room.name}</h4>
                        {room.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastMessageTime(room.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        {room.last_message ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {room.last_message.message_type === 'text' 
                              ? room.last_message.content 
                              : `📎 ${room.last_message.file_name || 'File'}`}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No messages yet
                          </p>
                        )}
                        
                        {room.type === 'group' && (
                          <Badge variant="outline" className="text-xs">
                            {room.participant_count} members
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
