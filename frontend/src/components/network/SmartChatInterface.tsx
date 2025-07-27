
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NetworkConnection } from "@/types/network";
import { useSmartChat } from "./chat/smart/useSmartChat";
import { SmartChatHeader } from "./chat/smart/ChatHeader";
import { SmartMessageList } from "./chat/smart/MessageList";
import { SmartMessageInput } from "./chat/smart/MessageInput";

interface SmartChatInterfaceProps {
  connection: NetworkConnection;
  onClose?: () => void;
}

export function SmartChatInterface({ connection, onClose }: SmartChatInterfaceProps) {
  const {
    inputValue,
    setInputValue,
    messages,
    suggestedTopics,
    isGeneratingTopics,
    messagesEndRef,
    isLoading,
    handleSendMessage,
    generateSmartTopics,
    useSuggestedTopic,
    formatTime,
    formatDate,
    searchQuery,
    onSearch,
    hasSearchResults,
    clearSearch
  } = useSmartChat(connection);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-0">
        <SmartChatHeader 
          connection={connection} 
          onClose={onClose} 
          searchQuery={searchQuery}
          onSearch={onSearch}
          clearSearch={clearSearch}
          hasSearchResults={hasSearchResults}
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <SmartMessageList
          messages={messages}
          messagesEndRef={messagesEndRef}
          connection={connection}
          formatDate={formatDate}
          formatTime={formatTime}
          suggestedTopics={suggestedTopics}
          isGeneratingTopics={isGeneratingTopics}
          useSuggestedTopic={useSuggestedTopic}
          isSearchActive={!!searchQuery}
          searchQuery={searchQuery}
        />

        <SmartMessageInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          generateSmartTopics={generateSmartTopics}
          suggestedTopicsExist={suggestedTopics.length > 0}
          isGeneratingTopics={isGeneratingTopics}
        />
      </CardContent>
    </Card>
  );
}
