
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NetworkConnection } from "@/types/network";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useSmartChat } from "@/hooks/useSmartChat";
import { MessageGroup } from "./MessageGroup";
import { TopicSuggestions } from "./TopicSuggestions";
import { getInitials } from "@/utils/userUtils";

interface RefactoredSmartChatProps {
  connection: NetworkConnection;
  onClose?: () => void;
}

export function RefactoredSmartChat({ connection, onClose }: RefactoredSmartChatProps) {
  const {
    inputValue,
    setInputValue,
    groupedMessages,
    suggestedTopics,
    isGeneratingTopics,
    isLoading,
    handleSendMessage,
    handleKeyDown,
    useSuggestedTopic,
    generateSmartTopics,
    formatTime
  } = useSmartChat(connection);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback>
                {getInitials(connection.name)}
              </AvatarFallback>
            )}
            {connection.onlineStatus && (
              <div 
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  connection.onlineStatus === 'online' ? 'bg-green-500' : 
                  connection.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
              />
            )}
          </Avatar>
          <div>
            <CardTitle className="text-base">{connection.name}</CardTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{connection.role} at {connection.company}</span>
              <span className="inline-flex w-1 h-1 bg-muted-foreground rounded-full mx-1"></span>
              <span className={`capitalize ${
                connection.onlineStatus === 'online' ? 'text-green-500' : 
                connection.onlineStatus === 'away' ? 'text-yellow-500' : 'text-gray-400'
              }`}>{connection.onlineStatus}</span>
            </div>
          </div>
        </div>

        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <MessageGroup
              key={date}
              date={date}
              messages={dateMessages}
              contactName={connection.name}
              contactAvatar={connection.avatar}
              formatTime={formatTime}
            />
          ))}
          <div id="messages-end" />
        </div>

        <TopicSuggestions
          topics={suggestedTopics}
          isGenerating={isGeneratingTopics}
          onSelectTopic={useSuggestedTopic}
        />

        <div className="p-3 border-t flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
          {!suggestedTopics.length && !isGeneratingTopics && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={generateSmartTopics} 
              title="Generate conversation starters"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
