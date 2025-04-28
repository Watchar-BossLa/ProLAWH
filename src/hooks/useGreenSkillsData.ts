
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GreenSkill } from '@/hooks/useGreenSkills';

export interface GreenSkillsAnalytics {
  environmentalImpact: {
    category: string;
    value: number;
    color: string;
  }[];
  careerOptions: {
    title: string;
    demandGrowth: number;
    salary: string;
    matchPercentage: number;
    requiredSkills: string[];
  }[];
  personalMetrics: {
    carbonReduction: number;
    skillsAcquired: number;
    marketGrowth: number;
    impactScore: number;
  };
  projects: {
    id: string;
    title: string;
    description: string;
    skillsNeeded: string[];
    teamSize: number;
    duration: string;
    category: string;
    impactArea: string;
  }[];
  learningPaths: {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
  }[];
}

export function useGreenSkillsData() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<GreenSkillsAnalytics>({
    environmentalImpact: [
      { category: 'Energy', value: 450, color: '#10B981' },
      { category: 'Transport', value: 300, color: '#3B82F6' },
      { category: 'Waste', value: 200, color: '#6366F1' },
      { category: 'Agriculture', value: 150, color: '#8B5CF6' }
    ],
    careerOptions: [
      {
        title: 'Sustainability Consultant',
        demandGrowth: 24,
        salary: '$80K-120K',
        matchPercentage: 85,
        requiredSkills: ['ESG Analysis', 'Carbon Accounting', 'Stakeholder Engagement']
      },
      {
        title: 'Green Energy Specialist',
        demandGrowth: 32,
        salary: '$90K-140K',
        matchPercentage: 78,
        requiredSkills: ['Renewable Systems', 'Energy Efficiency', 'Project Management']
      },
      {
        title: 'Circular Economy Expert',
        demandGrowth: 18,
        salary: '$75K-115K',
        matchPercentage: 72,
        requiredSkills: ['Supply Chain', 'Waste Reduction', 'Product Lifecycle']
      }
    ],
    personalMetrics: {
      carbonReduction: 75,
      skillsAcquired: 6,
      marketGrowth: 85,
      impactScore: 68
    },
    projects: [
      {
        id: '1',
        title: 'Urban Solar Initiative',
        description: 'Implementing solar panel networks in urban environments to reduce grid dependency',
        skillsNeeded: ['Solar Technology', 'Urban Planning', 'Project Management', 'Community Engagement'],
        teamSize: 5,
        duration: '3 months',
        category: 'Energy',
        impactArea: 'Climate'
      },
      {
        id: '2',
        title: 'Sustainable Supply Chain Optimization',
        description: 'Reducing carbon footprint in manufacturing supply chains through advanced analytics',
        skillsNeeded: ['Supply Chain', 'Data Analysis', 'Carbon Accounting', 'Industry Partnerships'],
        teamSize: 4,
        duration: '2 months',
        category: 'Business',
        impactArea: 'Emissions'
      },
      {
        id: '3',
        title: 'Ocean Plastic Recovery System',
        description: 'Developing automated systems for ocean plastic collection and recycling',
        skillsNeeded: ['Marine Engineering', 'Plastic Recycling', 'Robotics', 'Waste Management'],
        teamSize: 6,
        duration: '6 months',
        category: 'Conservation',
        impactArea: 'Conservation'
      }
    ],
    learningPaths: [
      {
        id: '1',
        title: 'Sustainable Supply Chain Management',
        description: 'Master green logistics and sustainable procurement',
        duration: '8 weeks',
        level: 'Intermediate'
      },
      {
        id: '2',
        title: 'Renewable Energy Technologies',
        description: 'Deep dive into solar, wind, and energy storage',
        duration: '12 weeks',
        level: 'Advanced'
      },
      {
        id: '3',
        title: 'ESG Analysis Fundamentals',
        description: 'Learn to evaluate environmental and social impact',
        duration: '6 weeks',
        level: 'Beginner'
      }
    ]
  });

  // Fetch real user green skill analytics (mocked for now)
  const { data: greenSkills } = useQuery({
    queryKey: ['green-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('green_skills')
        .select('*');

      if (error) throw error;
      return data as GreenSkill[];
    }
  });

  // In the future, this would fetch real user data from the backend
  // based on their actual skills and learning progress
  useEffect(() => {
    if (user && greenSkills) {
      // This would be replaced with actual API calls to get personalized data
      console.log("Would fetch personalized data for user", user.id);
      
      // For now we'll just adjust mock data based on skills count
      const skillCount = greenSkills.length;
      if (skillCount > 0) {
        setAnalyticsData(prev => ({
          ...prev,
          personalMetrics: {
            ...prev.personalMetrics,
            skillsAcquired: Math.min(skillCount, 10),
            carbonReduction: Math.min(75 + skillCount * 2, 100)
          }
        }));
      }
    }
  }, [user, greenSkills]);

  return analyticsData;
}
