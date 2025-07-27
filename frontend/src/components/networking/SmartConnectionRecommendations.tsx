
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, MessageCircle, Star, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NetworkConnection } from '@/types/network';

interface ConnectionScore {
  overall: number;
  mutualConnections: number;
  skillAlignment: number;
  industryRelevance: number;
  careerStage: number;
  activityLevel: number;
}

interface SmartRecommendation extends NetworkConnection {
  score: ConnectionScore;
  reasons: string[];
  mutualConnections: number;
  potentialValue: 'High' | 'Medium' | 'Low';
  recommendationType: 'career_growth' | 'skill_development' | 'industry_insight' | 'collaboration';
}

export function SmartConnectionRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock AI-powered recommendations - in real app this would call AI service
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecommendations: SmartRecommendation[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Sarah Chen',
          title: 'Senior Data Scientist at Meta',
          avatar: '',
          role: 'Data Scientist',
          company: 'Meta',
          connectionType: 'peer',
          connectionStrength: 85,
          lastInteraction: '2024-01-15',
          status: 'pending',
          skills: ['Machine Learning', 'Python', 'Data Analysis'],
          bio: 'Passionate about AI ethics and sustainable technology',
          location: 'San Francisco, CA',
          onlineStatus: 'online',
          industry: 'Technology',
          careerPath: 'Data Science',
          expertise: ['AI/ML', 'Data Engineering', 'Product Analytics'],
          score: {
            overall: 92,
            mutualConnections: 15,
            skillAlignment: 88,
            industryRelevance: 95,
            careerStage: 85,
            activityLevel: 90
          },
          reasons: [
            'Works with similar technologies',
            '15 mutual connections',
            'Strong thought leadership in AI ethics',
            'Active in sustainability initiatives'
          ],
          mutualConnections: 15,
          potentialValue: 'High',
          recommendationType: 'skill_development'
        },
        {
          id: '2',
          userId: 'user2',
          name: 'Marcus Rodriguez',
          title: 'VP of Engineering at Stripe',
          avatar: '',
          role: 'Engineering Leader',
          company: 'Stripe',
          connectionType: 'mentor',
          connectionStrength: 78,
          lastInteraction: '2024-01-10',
          status: 'pending',
          skills: ['Leadership', 'Scaling Teams', 'Fintech'],
          bio: 'Building the future of payments',
          location: 'Remote',
          onlineStatus: 'away',
          industry: 'Fintech',
          careerPath: 'Engineering Leadership',
          expertise: ['Team Building', 'System Architecture', 'Product Strategy'],
          score: {
            overall: 89,
            mutualConnections: 8,
            skillAlignment: 75,
            industryRelevance: 85,
            careerStage: 95,
            activityLevel: 80
          },
          reasons: [
            'Senior leader in your target industry',
            'Strong engineering background',
            'Experience scaling technical teams',
            'Active mentor in the community'
          ],
          mutualConnections: 8,
          potentialValue: 'High',
          recommendationType: 'career_growth'
        },
        {
          id: '3',
          userId: 'user3',
          name: 'Dr. Emily Watson',
          title: 'Climate Tech Researcher at MIT',
          avatar: '',
          role: 'Researcher',
          company: 'MIT',
          connectionType: 'colleague',
          connectionStrength: 72,
          lastInteraction: '2024-01-08',
          status: 'pending',
          skills: ['Climate Science', 'Research', 'Sustainability'],
          bio: 'Researching scalable climate solutions',
          location: 'Boston, MA',
          onlineStatus: 'online',
          industry: 'Research',
          careerPath: 'Climate Technology',
          expertise: ['Climate Modeling', 'Green Technology', 'Policy'],
          score: {
            overall: 86,
            mutualConnections: 12,
            skillAlignment: 82,
            industryRelevance: 90,
            careerStage: 80,
            activityLevel: 85
          },
          reasons: [
            'Leading research in climate tech',
            'Strong academic background',
            'Connected to innovation ecosystem',
            'Frequent conference speaker'
          ],
          mutualConnections: 12,
          potentialValue: 'High',
          recommendationType: 'industry_insight'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    };

    if (user) {
      generateRecommendations();
    }
  }, [user]);

  const handleConnect = async (recommendationId: string) => {
    // Implementation for sending connection request
    console.log('Connecting to:', recommendationId);
  };

  const handleMessage = async (recommendationId: string) => {
    // Implementation for sending message
    console.log('Messaging:', recommendationId);
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'career_growth': return <TrendingUp className="h-4 w-4" />;
      case 'skill_development': return <Star className="h-4 w-4" />;
      case 'industry_insight': return <Users className="h-4 w-4" />;
      case 'collaboration': return <MessageCircle className="h-4 w-4" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  };

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case 'career_growth': return 'Career Growth';
      case 'skill_development': return 'Skill Development';
      case 'industry_insight': return 'Industry Insight';
      case 'collaboration': return 'Collaboration';
      default: return 'General';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Connection Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Smart Connection Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={rec.avatar} />
                    <AvatarFallback>
                      {rec.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{rec.name}</h4>
                    <p className="text-sm text-muted-foreground">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getRecommendationTypeIcon(rec.recommendationType)}
                    <span className="ml-1">
                      {getRecommendationTypeLabel(rec.recommendationType)}
                    </span>
                  </Badge>
                  <Badge 
                    variant={rec.potentialValue === 'High' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {rec.potentialValue} Value
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {rec.mutualConnections} mutual
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {rec.score.overall}% match
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm">{rec.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {rec.skills?.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Why we recommend {rec.name.split(' ')[0]}:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {rec.reasons.map((reason, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={() => handleConnect(rec.id)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleMessage(rec.id)}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
