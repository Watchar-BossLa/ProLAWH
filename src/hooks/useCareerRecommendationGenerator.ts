
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGreenSkills } from '@/hooks/useGreenSkills';
import { useSkillGapData } from '@/hooks/useSkillGapData';
import { CareerRecommendation } from '@/types/career';

export function useCareerRecommendationGenerator() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: greenSkills } = useGreenSkills();
  const skillGapData = useSkillGapData();

  // Generate and add a new recommendation
  const generateRecommendation = async () => {
    if (!user) {
      setError(new Error('You must be logged in to create recommendations'));
      return null;
    }

    setIsGenerating(true);
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
      setIsGenerating(false);
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
    generateRecommendation,
    isGenerating,
    error
  };
}
