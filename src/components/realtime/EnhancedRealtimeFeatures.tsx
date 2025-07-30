import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video, Mic, MicOff, Camera, CameraOff, Users, MessageSquare, Share } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnlineUser {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy';
  last_seen: string;
  current_activity?: string;
}

interface LiveSession {
  id: string;
  title: string;
  host: string;
  participants: number;
  type: 'study-group' | 'mentoring' | 'workshop';
  started_at: string;
}

export function EnhancedRealtimeFeatures() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentPresence, setCurrentPresence] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setupPresenceTracking();
      fetchOnlineUsers();
      fetchLiveSessions();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const setupPresenceTracking = () => {
    // Mock presence tracking for demonstration
    const mockUsers: OnlineUser[] = [
      { id: '1', name: 'Alex Johnson', status: 'online', last_seen: new Date().toISOString(), current_activity: 'studying' },
      { id: '2', name: 'Sarah Chen', status: 'busy', last_seen: new Date().toISOString(), current_activity: 'in-meeting' },
      { id: '3', name: 'Mike Rodriguez', status: 'away', last_seen: new Date(Date.now() - 300000).toISOString() },
    ];
    
    setOnlineUsers(mockUsers);

    // Simulate real-time presence updates
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev.map(user => ({
        ...user,
        last_seen: user.status === 'online' ? new Date().toISOString() : user.last_seen
      })));
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  };

  const fetchOnlineUsers = async () => {
    // Already handled in setupPresenceTracking
  };

  const fetchLiveSessions = async () => {
    // Mock data for demonstration
    const mockSessions: LiveSession[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals Study Group',
        host: 'Dr. Smith',
        participants: 12,
        type: 'study-group',
        started_at: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '2',
        title: 'Career Mentoring Session',
        host: 'Lisa Wang',
        participants: 3,
        type: 'mentoring',
        started_at: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: '3',
        title: 'React Workshop: Advanced Patterns',
        host: 'Tech Academy',
        participants: 25,
        type: 'workshop',
        started_at: new Date(Date.now() - 600000).toISOString()
      }
    ];
    setLiveSessions(mockSessions);
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to live session updates
    const sessionsChannel = supabase
      .channel('live_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_sessions'
        },
        () => {
          fetchLiveSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
    };
  };

  const joinSession = async (sessionId: string) => {
    // Mock join functionality
    console.log('Joining session:', sessionId);
    // In a real implementation, this would initiate video/audio connection
  };

  const startNewSession = async () => {
    // Mock start session functionality
    console.log('Starting new session');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'study-group': return <Users className="h-4 w-4" />;
      case 'mentoring': return <MessageSquare className="h-4 w-4" />;
      case 'workshop': return <Share className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Live Collaboration</h2>
          <p className="text-muted-foreground">
            Connect and learn with others in real-time
          </p>
        </div>
        <Button onClick={startNewSession} className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Start Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Online Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Users ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.current_activity || formatTimeAgo(user.last_seen)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Live Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Live Sessions ({liveSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getSessionTypeIcon(session.type)}
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          Live
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => joinSession(session.id)}
                        className="flex items-center gap-1"
                      >
                        <Video className="h-3 w-3" />
                        Join
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Host: {session.host}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {session.participants}
                        </span>
                        <span>{formatTimeAgo(session.started_at)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Video Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Media Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={isVideoEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className="flex items-center gap-2"
            >
              {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              {isVideoEnabled ? 'Video On' : 'Video Off'}
            </Button>
            
            <Button
              variant={isAudioEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="flex items-center gap-2"
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {isAudioEnabled ? 'Audio On' : 'Audio Off'}
            </Button>
            
            <div className="ml-auto text-sm text-muted-foreground">
              Status: {currentPresence ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}