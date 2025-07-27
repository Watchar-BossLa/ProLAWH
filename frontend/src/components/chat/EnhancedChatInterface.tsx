
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { useAdvancedSearch } from "@/hooks/chat/useAdvancedSearch";
import { useChatState } from "@/hooks/chat/useChatState";
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInputArea } from './components/ChatInputArea';
import { SearchInterface } from './SearchInterface';

interface EnhancedChatInterfaceProps {
  connectionId: string;
  connectionName: string;
  connectionAvatar?: string;
  onClose?: () => void;
}

export function EnhancedChatInterface({
  connectionId,
  connectionName,
  connectionAvatar,
  onClose
}: EnhancedChatInterfaceProps) {
  const {
    message,
    showSearch,
    showFileUpload,
    replyToMessage,
    handleTyping,
    clearMessage,
    toggleSearch,
    toggleFileUpload,
    handleReply,
    cancelReply
  } = useChatState();

  const {
    messages,
    sendMessage,
    uploadFile,
    addReaction,
    removeReaction,
    typingUsers,
    onlineStatus
  } = useRealTimeChat(connectionId);

  const {
    query: searchQuery,
    filters,
    searchResults,
    suggestions,
    highlightedMessages,
    isSearchActive,
    hasResults,
    totalResults,
    updateQuery,
    updateFilters,
    clearSearch
  } = useAdvancedSearch({ 
    messages,
    onSearch: (query) => console.log('Search:', query)
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage({ content: message, type: 'text' });
    clearMessage();
  };

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        const messageType = file.type.startsWith('image/') ? 'image' : 'file';
        await sendMessage({
          content: `Shared ${messageType}: ${file.name}`,
          type: messageType,
          file_url: uploadedFile.url,
          file_name: uploadedFile.name
        });
      }
    }
    toggleFileUpload();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = isSearchActive ? highlightedMessages : messages;
  const isConnected = onlineStatus === 'online';

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <ChatHeader
          connectionName={connectionName}
          connectionAvatar={connectionAvatar}
          isConnected={isConnected}
          showSearch={showSearch}
          onToggleSearch={toggleSearch}
          onClose={onClose}
        />
        
        {showSearch && (
          <div className="mt-3">
            <SearchInterface
              query={searchQuery}
              onQueryChange={updateQuery}
              filters={filters}
              onFiltersChange={updateFilters}
              suggestions={suggestions}
              onSuggestionSelect={updateQuery}
              onClear={clearSearch}
              totalResults={totalResults}
              isActive={isSearchActive}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ChatMessageList
          messages={displayMessages}
          typingUsers={typingUsers}
          isSearchActive={isSearchActive}
          onReplyToMessage={handleReply}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
        />

        <ChatInputArea
          message={message}
          onMessageChange={handleTyping}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          showFileUpload={showFileUpload}
          onToggleFileUpload={toggleFileUpload}
          onFileUpload={handleFileUpload}
          replyToMessage={replyToMessage}
          onCancelReply={cancelReply}
        />
      </CardContent>
    </Card>
  );
}
