
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageCircle } from "lucide-react";

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  generateSmartTopics: () => void;
  suggestedTopicsExist: boolean;
  isGeneratingTopics: boolean;
}

export function SmartMessageInput({
  inputValue,
  setInputValue,
  handleSendMessage,
  isLoading,
  generateSmartTopics,
  suggestedTopicsExist,
  isGeneratingTopics
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
      {!suggestedTopicsExist && !isGeneratingTopics && (
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
  );
}
