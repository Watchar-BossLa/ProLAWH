
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, MapPin } from 'lucide-react';
import { useBehaviorProfile } from '@/hooks/ai/useBehaviorProfile';
import { BehaviorProfileHeader } from './forms/BehaviorProfileHeader';
import { WorkStyleSelector } from './forms/WorkStyleSelector';
import type { BehaviorProfile } from '@/types/ai-matching';

const projectDurations = ['Short-term (< 1 month)', 'Medium-term (1-6 months)', 'Long-term (6+ months)', 'Ongoing'];
const communicationStyles = ['Direct', 'Diplomatic', 'Analytical', 'Enthusiastic', 'Supportive'];

interface BehaviorProfileFormProps {
  onComplete?: () => void;
}

export function BehaviorProfileForm({ onComplete }: BehaviorProfileFormProps) {
  const { behaviorProfile, updateBehaviorProfile } = useBehaviorProfile();
  const [formData, setFormData] = useState({
    work_style_preferences: behaviorProfile?.work_style_preferences || {},
    collaboration_preferences: behaviorProfile?.collaboration_preferences || {},
    learning_preferences: behaviorProfile?.learning_preferences || {},
    career_goals: behaviorProfile?.career_goals || {},
    risk_tolerance: behaviorProfile?.risk_tolerance || 0.5,
    flexibility_score: behaviorProfile?.flexibility_score || 0.5,
    communication_style: behaviorProfile?.communication_style || '',
    preferred_project_duration: behaviorProfile?.preferred_project_duration || [],
    industry_preferences: behaviorProfile?.industry_preferences || [],
    location_preferences: behaviorProfile?.location_preferences || {}
  });

  const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>(
    formData.work_style_preferences?.styles || []
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    formData.preferred_project_duration || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData: Partial<BehaviorProfile> = {
      ...formData,
      work_style_preferences: {
        ...formData.work_style_preferences,
        styles: selectedWorkStyles
      },
      preferred_project_duration: selectedDurations,
      updated_at: new Date().toISOString()
    };

    updateBehaviorProfile(profileData);
    onComplete?.();
  };

  const toggleWorkStyle = (style: string) => {
    setSelectedWorkStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDurations(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <BehaviorProfileHeader />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Work Style Preferences */}
          <WorkStyleSelector 
            selectedWorkStyles={selectedWorkStyles}
            onToggle={toggleWorkStyle}
          />

          {/* Risk Tolerance */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Risk Tolerance</Label>
            <div className="space-y-2">
              <Slider
                value={[formData.risk_tolerance * 100]}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, risk_tolerance: value[0] / 100 }))
                }
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Conservative</span>
                <span>Risk-taking</span>
              </div>
            </div>
          </div>

          {/* Flexibility Score */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Schedule Flexibility</Label>
            <div className="space-y-2">
              <Slider
                value={[formData.flexibility_score * 100]}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, flexibility_score: value[0] / 100 }))
                }
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Fixed Schedule</span>
                <span>Very Flexible</span>
              </div>
            </div>
          </div>

          {/* Communication Style */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Communication Style</Label>
            <Select
              value={formData.communication_style}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, communication_style: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your communication style" />
              </SelectTrigger>
              <SelectContent>
                {communicationStyles.map(style => (
                  <SelectItem key={style} value={style.toLowerCase()}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Duration Preferences */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Preferred Project Duration</Label>
            <div className="flex flex-wrap gap-2">
              {projectDurations.map(duration => (
                <Badge
                  key={duration}
                  variant={selectedDurations.includes(duration) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleDuration(duration)}
                >
                  {duration}
                </Badge>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-semibold">Career Goals</Label>
            </div>
            <Textarea
              placeholder="Describe your short-term and long-term career goals..."
              value={formData.career_goals?.description || ''}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  career_goals: { ...prev.career_goals, description: e.target.value }
                }))
              }
              rows={4}
            />
          </div>

          {/* Location Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-semibold">Location Preferences</Label>
            </div>
            <Textarea
              placeholder="Describe your location preferences (remote, specific cities, travel requirements, etc.)"
              value={formData.location_preferences?.description || ''}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  location_preferences: { ...prev.location_preferences, description: e.target.value }
                }))
              }
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Save AI Profile & Generate Matches
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
