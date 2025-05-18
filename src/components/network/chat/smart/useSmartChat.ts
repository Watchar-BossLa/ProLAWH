
import { useState, useRef, useEffect } from "react";
import { useLLM } from '@/hooks/useLLM';
import { NetworkConnection } from "@/types/network";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

export function useSmartChat(connection: NetworkConnection) {
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

  return {
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
    formatDate
  };
}
