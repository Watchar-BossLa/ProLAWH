
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkConnection } from "@/types/network";
import { useLLM } from '@/hooks/useLLM';
import { Loader2, Send, Sparkles, MessageCircle, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

interface SmartChatInterfaceProps {
  connection: NetworkConnection;
  onClose?: () => void;
}

export function SmartChatInterface({ connection, onClose }: SmartChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generate, isLoading } = useLLM();

  // Load conversation history (mock data)
  useEffect(() => {
    // In a real application, fetch chat history from an API
    const mockHistory: Message[] = [
      {
        id: '1',
        sender: 'user',
        content: `Hi ${connection.name}, how are things going with your latest project?`,
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        sender: 'contact',
        content: `Hey there! The project is going well. We just finished the first milestone ahead of schedule. How about your work on the new features?`,
        timestamp: new Date(Date.now() - 82800000).toISOString() // 23 hours ago
      }
    ];
    
    setMessages(mockHistory);
    generateSmartTopics();
  }, [connection.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // Mock response - in a real app, this would be sent through a messaging API
    setTimeout(() => {
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for reaching out! I'm currently focusing on ${connection.skills?.[0] || 'my projects'}. Let's schedule some time to discuss collaboration opportunities.`,
        sender: 'contact',
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, mockResponse]);

      // Generate new topics after a conversation
      if (messages.length % 4 === 0) {
        generateSmartTopics();
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateSmartTopics = async () => {
    setIsGeneratingTopics(true);
    try {
      const prompt = `
        I need context-aware conversation starters for a professional networking chat.
        
        My contact is ${connection.name}, who works as a ${connection.role} at ${connection.company}.
        
        Their skills include: ${connection.skills?.join(', ') || 'unknown'}
        Their industry is: ${connection.industry || 'unknown'}
        My skills include: React, TypeScript, UI/UX Design, Product Management, Data Analysis
        
        Generate 3 professional, context-aware conversation starters that would be relevant for us to discuss.
        Consider skill overlap, potential collaboration opportunities, industry trends, or mentorship possibilities.
        
        Return only the 3 conversation starters, each on a new line. Keep each one concise (under 100 characters).
      `;

      const response = await generate({
        task: 'text-generation',
        inputs: prompt,
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      });

      if (response?.generated_text) {
        const topics = response.generated_text
          .split('\n')
          .filter(line => line.trim())
          .slice(0, 3)
          .map(topic => topic.replace(/^\d+\.\s*/, '').trim()); // Remove numbering if present
        
        setSuggestedTopics(topics);
      }
    } catch (error) {
      console.error('Failed to generate conversation topics:', error);
      setSuggestedTopics([
        `How's your work with ${connection.skills?.[0] || 'your projects'} going?`,
        'Any interesting industry developments lately?',
        'Would you be open to collaborating on a side project?'
      ]);
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const useSuggestedTopic = (topic: string) => {
    setInputValue(topic);
    // Remove the used topic from suggestions
    setSuggestedTopics(prev => prev.filter(t => t !== topic));
    toast.success("Topic selected!");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback>
                {connection.name.substring(0, 2).toUpperCase()}
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
            <div key={date} className="mb-4">
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className="text-xs font-normal">
                  {date}
                </Badge>
              </div>
              
              {dateMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'contact' && (
                    <Avatar className="h-8 w-8 mr-2">
                      {connection.avatar ? (
                        <AvatarImage src={connection.avatar} alt={connection.name} />
                      ) : (
                        <AvatarFallback>
                          {connection.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {suggestedTopics.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex items-center mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span className="text-xs font-medium">Suggested conversation starters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer text-xs py-1 hover:bg-secondary/80"
                  onClick={() => useSuggestedTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
              {isGeneratingTopics && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Generating...
                </Badge>
              )}
            </div>
          </div>
        )}

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
