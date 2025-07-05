
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  UserPlus, 
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react';
import { SmartConnectionRecommendations } from './SmartConnectionRecommendations';
import { VideoCallButton } from './VideoCallButton';
import { NetworkConnection } from '@/types/network';

// Mock data for demonstration
const mockConnections: NetworkConnection[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Alex Thompson',
    title: 'Senior Product Manager at Google',
    avatar: '',
    role: 'Product Manager',
    company: 'Google',
    connectionType: 'peer',
    connectionStrength: 92,
    lastInteraction: '2024-01-15',
    status: 'connected',
    skills: ['Product Strategy', 'User Research', 'Data Analysis'],
    bio: 'Passionate about building products that scale',
    location: 'San Francisco, CA',
    onlineStatus: 'online',
    industry: 'Technology',
    careerPath: 'Product Management',
    expertise: ['Product Strategy', 'Growth', 'Analytics']
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Maria Rodriguez',
    title: 'VP Engineering at Stripe',
    avatar: '',
    role: 'Engineering Leader',
    company: 'Stripe',
    connectionType: 'mentor',
    connectionStrength: 88,
    lastInteraction: '2024-01-12',
    status: 'connected',
    skills: ['Leadership', 'System Design', 'Team Building'],
    bio: 'Building the future of payments',
    location: 'Remote',
    onlineStatus: 'away',
    industry: 'Fintech',
    careerPath: 'Engineering Leadership',
    expertise: ['Technical Leadership', 'Scaling Teams', 'Architecture']
  }
];

export function EnhancedNetworkPage() {
  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Connections</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Network Growth</p>
              <p className="text-2xl font-bold">+23%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <MessageCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
              <p className="text-2xl font-bold">14</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Meetings This Week</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Recommendations */}
      <SmartConnectionRecommendations />

      {/* Active Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Professional Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockConnections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{connection.name}</h4>
                      <p className="text-sm text-muted-foreground">{connection.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{connection.location}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          connection.onlineStatus === 'online' ? 'bg-green-500' : 
                          connection.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {connection.connectionType}
                    </Badge>
                    <Badge 
                      variant={connection.connectionStrength > 80 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {connection.connectionStrength}% strong
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{connection.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {connection.skills?.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <VideoCallButton connection={connection} variant="video" />
                  <VideoCallButton connection={connection} variant="audio" />
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
