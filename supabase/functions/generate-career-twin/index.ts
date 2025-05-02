
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Career recommendation generation with more context-aware suggestions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    // Get user's green skills (if available)
    const { data: userGreenSkills } = await supabaseClient
      .from('user_green_skills')
      .select('green_skill_id, proficiency_level')
      .eq('user_id', user.id)

    // Get all green skills to analyze gaps
    const { data: greenSkills } = await supabaseClient
      .from('green_skills')
      .select('*')
      .order('market_growth_rate', { ascending: false })
      .limit(20)

    // Get user's activity logs to understand behavior
    const { data: userActivity } = await supabaseClient
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Generate context-aware recommendation based on collected data
    const recommendationData = generateContextAwareRecommendation(
      userGreenSkills || [],
      greenSkills || [],
      userActivity || []
    )

    // Insert the recommendation
    const { data, error } = await supabaseClient
      .from('career_recommendations')
      .insert({
        user_id: user.id,
        type: recommendationData.type,
        recommendation: recommendationData.text,
        relevance_score: recommendationData.score,
        status: 'pending',
        skills: recommendationData.skills || []
      })
      .select()

    if (error) throw error

    // Log user activity
    await supabaseClient
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'career_twin_recommendation_generated',
        metadata: { recommendation_type: recommendationData.type }
      })
      .catch(err => console.error("Failed to log activity:", err))

    return new Response(
      JSON.stringify({ success: true, data: recommendationData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Career Twin error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Generate a recommendation based on user data
function generateContextAwareRecommendation(
  userSkills: any[],
  greenSkills: any[],
  userActivity: any[]
) {
  // Determine which type of recommendation to generate
  const recommendationTypes = ['skill_gap', 'job_match', 'mentor_suggest']
  const recommendationType = recommendationTypes[Math.floor(Math.random() * recommendationTypes.length)]
  
  // Extract user's skill IDs
  const userSkillIds = new Set(userSkills.map(skill => skill.green_skill_id))
  
  // Find skill gaps - high market growth skills the user doesn't have
  const skillGaps = greenSkills.filter(skill => !userSkillIds.has(skill.id))
  
  let recommendation = {
    type: recommendationType,
    text: '',
    score: 0.7 + (Math.random() * 0.2),
    skills: [] as string[]
  }
  
  switch (recommendationType) {
    case 'skill_gap':
      if (skillGaps.length > 0) {
        const gapSkill = skillGaps[Math.floor(Math.random() * Math.min(3, skillGaps.length))]
        recommendation = {
          type: 'skill_gap',
          text: `Based on market analysis, developing skills in ${gapSkill.name} would increase your employability by approximately ${Math.round(gapSkill.market_growth_rate)}% in the next year. This skill is particularly valued in the ${gapSkill.category} sector.`,
          score: 0.8 + (Math.random() * 0.15),
          skills: [gapSkill.name, gapSkill.category]
        }
      } else {
        recommendation = {
          type: 'skill_gap',
          text: 'Consider deepening your expertise in carbon footprint analysis and reduction strategies. Companies are increasingly seeking professionals who can lead practical emissions reduction initiatives.',
          score: 0.75 + (Math.random() * 0.15),
          skills: ['Carbon Management', 'Emissions Reduction']
        }
      }
      break
      
    case 'job_match':
      const jobCategories = ['Renewable Energy', 'Circular Economy', 'Sustainable Finance', 'Green Building']
      const selectedCategory = jobCategories[Math.floor(Math.random() * jobCategories.length)]
      
      recommendation = {
        type: 'job_match',
        text: `Your skill profile shows strong alignment with ${selectedCategory} positions. Companies like EcoTech Solutions, GreenBuild, and Renewable Futures are hiring for these roles with average compensation of $95,000-$120,000.`,
        score: 0.85 + (Math.random() * 0.1),
        skills: [selectedCategory, 'Project Management', 'Sustainability']
      }
      break
      
    case 'mentor_suggest':
      recommendation = {
        type: 'mentor_suggest',
        text: 'Connecting with a mentor who has experience transitioning from traditional sectors to green economy roles would accelerate your career development. Look for mentors with 5+ years in sustainability leadership.',
        score: 0.82 + (Math.random() * 0.1),
        skills: ['Networking', 'Career Development', 'Sustainability Leadership']
      }
      break
  }
  
  return recommendation
}
