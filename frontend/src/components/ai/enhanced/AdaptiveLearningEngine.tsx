
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target,
  Activity,
  Lightbulb,
  RefreshCw,
  BarChart3
} from "lucide-react";

interface LearningPattern {
  id: string;
  patternType: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'multimodal';
  strength: number;
  adaptationScore: number;
  lastUpdated: string;
}

interface AdaptiveMetrics {
  learningVelocity: number;
  retentionRate: number;
  engagementScore: number;
  adaptationEfficiency: number;
  personalizedAccuracy: number;
}

interface LearningRecommendation {
  id: string;
  type: 'content_format' | 'pacing' | 'difficulty' | 'methodology' | 'schedule';
  recommendation: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
}

export function AdaptiveLearningEngine() {
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [adaptiveMetrics, setAdaptiveMetrics] = useState<AdaptiveMetrics>({
    learningVelocity: 0.78,
    retentionRate: 0.85,
    engagementScore: 0.82,
    adaptationEfficiency: 0.91,
    personalizedAccuracy: 0.88
  });
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [learningHistory, setLearningHistory] = useState([
    { session: 1, velocity: 0.65, retention: 0.72, engagement: 0.68 },
    { session: 2, velocity: 0.71, retention: 0.78, engagement: 0.74 },
    { session: 3, velocity: 0.76, retention: 0.82, engagement: 0.79 },
    { session: 4, velocity: 0.78, retention: 0.85, engagement: 0.82 }
  ]);

  useEffect(() => {
    // Initialize learning patterns
    setLearningPatterns([
      {
        id: 'visual',
        patternType: 'visual',
        strength: 0.85,
        adaptationScore: 0.92,
        lastUpdated: '2 hours ago'
      },
      {
        id: 'kinesthetic',
        patternType: 'kinesthetic',
        strength: 0.72,
        adaptationScore: 0.78,
        lastUpdated: '4 hours ago'
      },
      {
        id: 'auditory',
        patternType: 'auditory',
        strength: 0.68,
        adaptationScore: 0.74,
        lastUpdated: '6 hours ago'
      },
      {
        id: 'reading',
        patternType: 'reading',
        strength: 0.79,
        adaptationScore: 0.86,
        lastUpdated: '1 hour ago'
      }
    ]);

    // Initialize recommendations
    setRecommendations([
      {
        id: 'rec-1',
        type: 'content_format',
        recommendation: 'Increase visual diagrams and interactive simulations by 35%',
        confidence: 0.91,
        impact: 'high',
        reasoning: 'Strong visual learning pattern detected with 85% preference strength'
      },
      {
        id: 'rec-2',
        type: 'pacing',
        recommendation: 'Implement micro-learning sessions of 15-20 minutes',
        confidence: 0.87,
        impact: 'medium',
        reasoning: 'Attention span analysis suggests optimal focus periods'
      },
      {
        id: 'rec-3',
        type: 'difficulty',
        recommendation: 'Adaptive difficulty scaling with 12% incremental increases',
        confidence: 0.84,
        impact: 'high',
        reasoning: 'Learning velocity indicates capacity for accelerated progression'
      },
      {
        id: 'rec-4',
        type: 'methodology',
        recommendation: 'Incorporate hands-on practice every 3rd learning module',
        confidence: 0.79,
        impact: 'medium',
        reasoning: 'Kinesthetic learning component shows positive correlation with retention'
      }
    ]);
  }, []);

  const handleAdaptationTrigger = () => {
    // Simulate real-time adaptation
    setAdaptiveMetrics(prev => ({
      ...prev,
      adaptationEfficiency: Math.min(0.98, prev.adaptationEfficiency + 0.02)
    }));
    
    // Update learning patterns
    setLearningPatterns(prev => prev.map(pattern => ({
      ...pattern,
      adaptationScore: Math.min(0.98, pattern.adaptationScore + 0.01),
      lastUpdated: 'Just now'
    })));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const radarData = learningPatterns.map(pattern => ({
    pattern: pattern.patternType,
    strength: pattern.strength * 100,
    adaptation: pattern.adaptationScore * 100
  }));

  return (
    <div className="space-y-6">
      {/* Adaptive Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Learning Velocity</span>
            </div>
            <div className="text-2xl font-bold">{(adaptiveMetrics.learningVelocity * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Retention Rate</span>
            </div>
            <div className="text-2xl font-bold">{(adaptiveMetrics.retentionRate * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <div className="text-2xl font-bold">{(adaptiveMetrics.engagementScore * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Adaptation Efficiency</span>
            </div>
            <div className="text-2xl font-bold">{(adaptiveMetrics.adaptationEfficiency * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Personalization</span>
            </div>
            <div className="text-2xl font-bold">{(adaptiveMetrics.personalizedAccuracy * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Patterns Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Learning Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="pattern" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Strength"
                  dataKey="strength"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Adaptation"
                  dataKey="adaptation"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Progress Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Adaptive Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={learningHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Learning Velocity"
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Retention Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  name="Engagement Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Learning Pattern Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Identified Learning Patterns
            </CardTitle>
            <Button onClick={handleAdaptationTrigger} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Trigger Adaptation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningPatterns.map((pattern) => (
            <div key={pattern.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold capitalize">{pattern.patternType} Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {pattern.lastUpdated}
                  </p>
                </div>
                <Badge variant="outline">
                  {(pattern.strength * 100).toFixed(0)}% strength
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pattern Strength</span>
                  <span>{(pattern.strength * 100).toFixed(1)}%</span>
                </div>
                <Progress value={pattern.strength * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Adaptation Score</span>
                  <span>{(pattern.adaptationScore * 100).toFixed(1)}%</span>
                </div>
                <Progress value={pattern.adaptationScore * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Adaptive Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Adaptive Learning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {rec.type.replace('_', ' ')}
                    </Badge>
                    <span className={`text-xs px-2 py-1 rounded ${getImpactColor(rec.impact)}`}>
                      {rec.impact} impact
                    </span>
                  </div>
                  <h3 className="font-medium">{rec.recommendation}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.reasoning}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {(rec.confidence * 100).toFixed(0)}% confidence
                  </div>
                  <Progress value={rec.confidence * 100} className="h-1 w-16 mt-1" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Apply Recommendation
                </Button>
                <Button size="sm" variant="ghost">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
