
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Leaf, Brain, TrendingUp, Users, DollarSign } from 'lucide-react';
import type { Opportunity } from "@/types/marketplace";

interface SmartOpportunityCardProps {
  opportunity: Opportunity;
  matchData?: {
    match_score: number;
    skill_compatibility: any;
    experience_fit: number;
    cultural_fit: number;
    compensation_alignment: number;
    success_prediction: number;
    reasoning: any;
  };
}

export function SmartOpportunityCard({ opportunity, matchData }: SmartOpportunityCardProps) {
  const matchScore = matchData ? Math.round(matchData.match_score * 100) : 0;
  const successPrediction = matchData ? Math.round(matchData.success_prediction * 100) : 0;

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="glass-card hover-card gradient-border relative overflow-hidden">
      {/* AI Match Score Badge */}
      {matchData && (
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            variant={getMatchBadgeVariant(matchScore)}
            className="flex items-center gap-1"
          >
            <Brain className="h-3 w-3" />
            {matchScore}% match
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-16">
            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {opportunity.company}
              {opportunity.has_insurance && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Insured
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{opportunity.description}</p>
        
        {/* AI Insights */}
        {matchData && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Analysis</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Skill Match</span>
                  <span className={getMatchColor(matchData.skill_compatibility?.score * 100 || 0)}>
                    {Math.round((matchData.skill_compatibility?.score || 0) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(matchData.skill_compatibility?.score || 0) * 100} 
                  className="h-1"
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span className={getMatchColor(successPrediction)}>
                    {successPrediction}%
                  </span>
                </div>
                <Progress value={successPrediction} className="h-1" />
              </div>
            </div>

            {/* Matched Skills */}
            {matchData.skill_compatibility?.matched_skills?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-green-600">
                  ✓ Matched Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {matchData.skill_compatibility.matched_skills.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs h-5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {matchData.skill_compatibility?.missing_skills?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-orange-600">
                  ⚠ Skills to Develop:
                </span>
                <div className="flex flex-wrap gap-1">
                  {matchData.skill_compatibility.missing_skills.slice(0, 2).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs h-5 border-orange-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Skills */}
        <div className="flex flex-wrap gap-2">
          {opportunity.skills_required.slice(0, 4).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.skills_required.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.skills_required.length - 4} more
            </Badge>
          )}
        </div>

        {/* Rate and Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{opportunity.rate_range}</span>
          </div>
          {opportunity.is_remote && (
            <Badge variant="outline" className="text-xs">Remote</Badge>
          )}
        </div>

        {/* Green Score */}
        {opportunity.green_score > 0 && (
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-500" />
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${opportunity.green_score}%` }}
              />
            </div>
            <span className="text-xs font-medium">{opportunity.green_score}% green</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1">
          {matchData && matchScore >= 80 ? 'Quick Apply' : 'Apply Now'}
        </Button>
        {matchData && matchScore >= 70 && (
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
