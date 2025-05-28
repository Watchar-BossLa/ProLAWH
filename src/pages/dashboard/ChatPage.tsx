
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Users, Search } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  created_by: string;
  created_at: string;
  participants?: any[];
  lastMessage?: {
    content: string;
    timestamp: string;
    sender_name: string;
  };
  unreadCount?: number;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [newChatName, setNewChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chat rooms
  useEffect(() => {
    if (!user) return;
    
    fetchChatRooms();
  }, [user]);

  const fetchChatRooms = async () => {
    if (!user) return;
    
    try {
      // Get chat rooms where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      if (participantData && participantData.length > 0) {
        const chatIds = participantData.map(p => p.chat_id);
        
        // Get chat room details
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .in('id', chatIds);

        if (roomsError) throw roomsError;

        // Get last messages for each chat
        const { data: lastMessages, error: messagesError } = await supabase
          .from('messages')
          .select('chat_id, content, created_at, sender_id')
          .in('chat_id', chatIds)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Combine data
        const rooms: ChatRoom[] = [];
        
        if (roomsData) {
          for (const room of roomsData) {
            const lastMsg = lastMessages?.find(m => m.chat_id === room.id);
            let senderName = 'Unknown';
            
            if (lastMsg?.sender_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', lastMsg.sender_id)
                .single();
              
              senderName = profile?.full_name || 'Unknown';
            }
            
            rooms.push({
              id: room.id,
              name: room.name || 'Direct Chat',
              type: (room.type as 'direct' | 'group') || 'group',
              created_by: room.created_by,
              created_at: room.created_at,
              lastMessage: lastMsg ? {
                content: lastMsg.content || 'File shared',
                timestamp: lastMsg.created_at,
                sender_name: senderName
              } : undefined,
              unreadCount: 0 // TODO: Implement unread count
            });
          }
        }

        setChatRooms(rooms);
        if (rooms.length > 0 && !selectedChatId) {
          setSelectedChatId(rooms[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!newChatName.trim() || !user) return;
    
    try {
      // Create new chat room
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name: newChatName,
          type: 'group',
          created_by: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as participant
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert({
          chat_id: roomData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (participantError) throw participantError;

      setNewChatName('');
      fetchChatRooms();
      setSelectedChatId(roomData.id);
      
      toast({
        title: "Success",
        description: "Chat room created successfully"
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
    }
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access chat</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Real-Time Chat</h1>
        <p className="text-muted-foreground mt-2">
          Connect and collaborate with your team in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Chat List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chats
              </CardTitle>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
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
              <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading chats...
                  </div>
                ) : filteredChatRooms.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No chats found
                  </div>
                ) : (
                  filteredChatRooms.map((chat) => (
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
                        <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {chat.lastMessage && (
                        <div className="space-y-1">
                          <p className="text-xs opacity-70 truncate">
                            {chat.lastMessage.sender_name}: {chat.lastMessage.content}
                          </p>
                          <p className="text-xs opacity-50">
                            {formatTime(chat.lastMessage.timestamp)}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                        <Users className="h-3 w-3" />
                        {chat.type === 'direct' ? 'Direct' : 'Group'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          {selectedChatId ? (
            <ChatInterface
              chatId={selectedChatId}
              chatName={chatRooms.find(c => c.id === selectedChatId)?.name}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
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
  );
}
