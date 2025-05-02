
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useGreenSkills } from '@/hooks/useGreenSkills';
import { useSkillGapData } from '@/hooks/useSkillGapData';

export interface CareerRecommendation {
  id: string;
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
  skills?: string[];
  resources?: {
    type: string;
    url?: string;
    title: string;
  }[];
}

export interface ImplementationPlan {
  id: string;
  user_id: string;
  recommendation_id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  steps: Array<{
    step: number;
    title: string;
    completed: boolean;
  }>;
  created_at: string;
  updated_at: string;
}

export function useCareerTwin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: greenSkills } = useGreenSkills();
  const skillGapData = useSkillGapData();

  // Get career recommendations for the current user
  const getRecommendations = async (type?: string, status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view recommendations'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Ensure the type field is properly typed as expected by CareerRecommendation
      const typedData: CareerRecommendation[] = data.map(item => ({
        ...item,
        type: item.type as 'skill_gap' | 'job_match' | 'mentor_suggest'
      }));
      
      return typedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching recommendations'));
      console.error('Error fetching career recommendations:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update recommendation status
  const updateRecommendationStatus = async (
    recommendationId: string,
    status: 'accepted' | 'rejected' | 'implemented'
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to update recommendations'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('career_recommendations')
        .update({ status })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `Recommendation status updated to ${status}.`,
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating recommendation'));
      console.error('Error updating recommendation status:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update the recommendation status.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Implement a recommendation
  const implementRecommendation = async (recommendationId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to implement recommendations'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      // First update the recommendation status to implemented
      const { error: updateError } = await supabase
        .from('career_recommendations')
        .update({ status: 'implemented' })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Then fetch the recommendation details
      const { data: recommendation, error: fetchError } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single();

      if (fetchError) throw fetchError;

      // Create implementation plan based on recommendation type
      const typedRecommendation = {
        ...recommendation,
        type: recommendation.type as 'skill_gap' | 'job_match' | 'mentor_suggest'
      };
      
      const planTitle = `Plan for ${
        typedRecommendation.type === 'skill_gap' ? 'Skill Development' : 
        typedRecommendation.type === 'job_match' ? 'Career Transition' : 
        'Finding Mentorship'
      }`;

      const { error: planError } = await supabase
        .from('user_implementation_plans')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          title: planTitle,
          status: 'in_progress',
          steps: generateImplementationSteps(typedRecommendation),
        });

      if (planError) throw planError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error implementing recommendation'));
      console.error('Error implementing recommendation:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Generate implementation steps based on recommendation type
  const generateImplementationSteps = (recommendation: CareerRecommendation) => {
    switch (recommendation.type) {
      case 'skill_gap':
        return [
          { step: 1, title: "Research courses", completed: false },
          { step: 2, title: "Enroll in relevant training", completed: false },
          { step: 3, title: "Complete initial assessment", completed: false },
          { step: 4, title: "Apply new skills in projects", completed: false }
        ];
      case 'job_match':
        return [
          { step: 1, title: "Update resume with relevant skills", completed: false },
          { step: 2, title: "Research target companies", completed: false },
          { step: 3, title: "Connect with professionals in field", completed: false },
          { step: 4, title: "Apply to suggested positions", completed: false }
        ];
      case 'mentor_suggest':
        return [
          { step: 1, title: "Review potential mentors", completed: false },
          { step: 2, title: "Prepare mentorship goals", completed: false },
          { step: 3, title: "Send mentorship request", completed: false },
          { step: 4, title: "Schedule first meeting", completed: false }
        ];
      default:
        return [
          { step: 1, title: "Review recommendation details", completed: false },
          { step: 2, title: "Create action steps", completed: false },
          { step: 3, title: "Set timeline for completion", completed: false }
        ];
    }
  };

  // Add a recommendation with real user data
  const addRecommendation = async () => {
    if (!user) {
      setError(new Error('You must be logged in to create recommendations'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      // Generate a personalized recommendation based on user skills and gaps
      const recommendationType = determineRecommendationType();
      const recommendation = generatePersonalizedRecommendation(recommendationType);
      
      const { data, error } = await supabase
        .from('career_recommendations')
        .insert({
          user_id: user.id,
          type: recommendationType,
          recommendation: recommendation.text,
          relevance_score: recommendation.score,
          status: 'pending',
          skills: recommendation.skills || []
        })
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding recommendation'));
      console.error('Error adding career recommendation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Determine what type of recommendation to generate based on user data
  const determineRecommendationType = (): 'skill_gap' | 'job_match' | 'mentor_suggest' => {
    // Alternate between recommendation types
    // In a real app, this would analyze user data to determine the most relevant type
    const types: ('skill_gap' | 'job_match' | 'mentor_suggest')[] = ['skill_gap', 'job_match', 'mentor_suggest'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Generate personalized recommendation text based on user data and type
  const generatePersonalizedRecommendation = (type: 'skill_gap' | 'job_match' | 'mentor_suggest') => {
    // Get user's green skill categories
    const userSkillCategories = skillGapData.map(item => item.subject);
    
    // Get skills with high market demand
    const highDemandSkills = greenSkills?.filter(skill => skill.market_growth_rate > 15) || [];
    
    // Find skill gaps - skills with high demand that aren't in user's top categories
    const potentialSkillGaps = highDemandSkills.filter(skill => 
      !userSkillCategories.includes(skill.category)
    );
    
    let recommendation = {
      text: '',
      score: 0,
      skills: [] as string[]
    };
    
    switch (type) {
      case 'skill_gap':
        if (potentialSkillGaps.length > 0) {
          const randomGap = potentialSkillGaps[Math.floor(Math.random() * potentialSkillGaps.length)];
          recommendation = {
            text: `Based on your skill profile, developing expertise in ${randomGap.name} would significantly enhance your career prospects. This skill has a ${randomGap.market_growth_rate}% growth rate in the green economy and complements your existing knowledge.`,
            score: 0.85 + (Math.random() * 0.1),
            skills: [randomGap.name]
          };
        } else {
          recommendation = {
            text: `Consider expanding your knowledge in sustainable technology implementation. This is a rapidly growing area with high demand across multiple sectors.`,
            score: 0.75 + (Math.random() * 0.1),
            skills: ['Sustainable Technology']
          };
        }
        break;
        
      case 'job_match':
        // Use user's top skill categories to suggest relevant jobs
        if (userSkillCategories.length > 0) {
          const category = userSkillCategories[0];
          const jobTitles: Record<string, string> = {
            'Energy': 'Renewable Energy Specialist',
            'Waste': 'Circular Economy Consultant',
            'Water': 'Water Resources Manager',
            'Agriculture': 'Sustainable Agriculture Specialist',
            'Transportation': 'Green Mobility Analyst',
            'Buildings': 'Green Building Engineer',
            'Conservation': 'Conservation Program Manager',
            'Policy': 'Environmental Policy Advisor'
          };
          
          const jobTitle = jobTitles[category] || 'Sustainability Consultant';
          
          recommendation = {
            text: `Your experience makes you an excellent fit for ${jobTitle} roles. Companies like EcoSolutions, GreenTech Innovations, and Sustainable Futures are actively hiring for these positions with salaries ranging from $85K-120K.`,
            score: 0.88 + (Math.random() * 0.1),
            skills: [category, 'Project Management', 'Sustainability']
          };
        } else {
          recommendation = {
            text: `Your profile shows strong alignment with Green Technology Implementation Specialist roles. Consider applying to innovative companies in the renewable energy sector.`,
            score: 0.82 + (Math.random() * 0.1),
            skills: ['Green Technology', 'Implementation']
          };
        }
        break;
        
      case 'mentor_suggest':
        recommendation = {
          text: `Connecting with a mentor who specializes in sustainable business development would help accelerate your career growth. Look for mentors with experience in transforming traditional business models to eco-friendly alternatives.`,
          score: 0.79 + (Math.random() * 0.1),
          skills: ['Networking', 'Sustainable Business', 'Career Development']
        };
        break;
    }
    
    return recommendation;
  };

  return {
    loading,
    error,
    getRecommendations,
    updateRecommendationStatus,
    implementRecommendation,
    addRecommendation
  };
}
