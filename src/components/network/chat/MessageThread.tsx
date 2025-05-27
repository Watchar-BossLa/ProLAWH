
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { ChatMessage } from '@/hooks/useRealtimeChat';

interface MessageThreadProps {
  parentMessage: ChatMessage;
  replies: ChatMessage[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onReply: (parentId: string) => void;
  currentUserId?: string;
}

export function MessageThread({
  parentMessage,
  replies,
  isExpanded,
  onToggleExpanded,
  onReply,
  currentUserId
}: MessageThreadProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-2">
      {/* Thread toggle button */}
      {replies.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-3 w-3" />
          <span>{replies.length} repl{replies.length === 1 ? 'y' : 'ies'}</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      )}

      {/* Expanded thread */}
      {isExpanded && (
        <div className="ml-8 space-y-3 border-l-2 border-muted pl-4">
          {replies.map((reply) => {
            const isCurrentUser = currentUserId && reply.sender_id === currentUserId;
            
            return (
              <div key={reply.id} className="flex gap-2">
                <Avatar className="h-6 w-6">
                  {reply.sender_avatar ? (
                    <AvatarImage src={reply.sender_avatar} alt={reply.sender_name} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {reply.sender_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{reply.sender_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(reply.timestamp)}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="text-xs h-4">You</Badge>
                    )}
                  </div>
                  
                  <div className="bg-muted/50 rounded p-2">
                    <p className="text-sm">{reply.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReply(parentMessage.id)}
            className="mt-2"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
      )}

      {/* Reply button for collapsed state */}
      {!isExpanded && replies.length === 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(parentMessage.id)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Reply
        </Button>
      )}
    </div>
  );
}
