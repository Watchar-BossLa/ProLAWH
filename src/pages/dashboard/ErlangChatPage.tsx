import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useErlangChat } from "@/hooks/useErlangChat";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ErlangChatPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>("erlang-demo");
  const [messageInput, setMessageInput] = useState("");

  const {
    messages,
    typingUsers,
    connectionStatus,
    isLoading,
    sendMessage,
    addReaction,
    updateTypingStatus,
    getSystemStatus
  } = useErlangChat(selectedChatId);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(messageInput);
    setMessageInput("");
    updateTypingStatus(false);
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    updateTypingStatus(value.length > 0);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Please log in to access Erlang Chat</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const systemStatus = getSystemStatus();

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* System Status */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Erlang System
              </h2>
              <div className="text-sm text-muted-foreground">
                Status: {connectionStatus}
              </div>
            </div>
            <div className="p-4 space-y-4">
              <Button
                variant={selectedChatId === "erlang-demo" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedChatId("erlang-demo")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Erlang Demo
              </Button>
              
              <div className="text-xs space-y-1">
                <div>Active Chats: {systemStatus?.user?.activeChats?.length || 0}</div>
                <div>Supervisor: {systemStatus?.supervisor?.childCount || 0} children</div>
                <div>Typing: {typingUsers.length} users</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Erlang-Inspired Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Actor-based messaging with fault tolerance
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading && (
                <div className="text-center text-muted-foreground">Loading...</div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-xs ${
                      message.sender_id === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {typingUsers.length > 0 && (
                <div className="text-sm text-muted-foreground italic">
                  {typingUsers.length} user(s) typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}