
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Users } from "lucide-react";
import { RealTimeChatInterface } from "@/components/chat/RealTimeChatInterface";

export default function RealTimeChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>('demo-chat-1');
  const [newChatName, setNewChatName] = useState('');

  // Mock chat rooms for demo
  const mockChats = [
    { id: 'demo-chat-1', name: 'General Discussion', participantCount: 12, unread: 3 },
    { id: 'demo-chat-2', name: 'Project Alpha', participantCount: 5, unread: 0 },
    { id: 'demo-chat-3', name: 'Design Team', participantCount: 8, unread: 1 },
  ];

  const createNewChat = () => {
    if (!newChatName.trim()) return;
    // This would normally create a new chat in the database
    console.log('Creating new chat:', newChatName);
    setNewChatName('');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Real-Time Chat</h1>
          <p className="text-muted-foreground mt-2">
            Connect and collaborate with your team in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Chat */}
                <div className="space-y-2">
                  <Input
                    placeholder="New chat name..."
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createNewChat()}
                  />
                  <Button 
                    onClick={createNewChat} 
                    className="w-full" 
                    size="sm"
                    disabled={!newChatName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Chat
                  </Button>
                </div>

                {/* Chat List */}
                <div className="space-y-2">
                  {mockChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedChatId === chat.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'
                        }
                      `}
                      onClick={() => setSelectedChatId(chat.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{chat.name}</h3>
                        {chat.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <Users className="h-3 w-3" />
                        {chat.participantCount} member{chat.participantCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            {selectedChatId ? (
              <RealTimeChatInterface
                chatId={selectedChatId}
                chatName={mockChats.find(c => c.id === selectedChatId)?.name}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
                  <p className="text-muted-foreground">
                    Choose a chat room from the sidebar or create a new one
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
