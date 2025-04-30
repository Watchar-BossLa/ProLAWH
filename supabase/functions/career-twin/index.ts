
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced recommendations with more specific career guidance
const sampleRecommendations = [
  {
    type: "skill_gap",
    recommendation: "Based on market trends, you should consider developing skills in Rust programming language. This could increase your job opportunities by 24% in the next 6 months.",
    relevance_score: 0.89
  },
  {
    type: "job_match",
    recommendation: "Your profile shows a strong match for Senior Backend Developer positions at fintech companies. Consider applying to Stripe, Square, or similar companies.",
    relevance_score: 0.92
  },
  {
    type: "mentor_suggest",
    recommendation: "You would benefit from connecting with mentors who have experience transitioning from backend to full-stack development. This matches your career trajectory.",
    relevance_score: 0.78
  },
  {
    type: "skill_gap",
    recommendation: "Adding expertise in Green Energy Systems could position you well for the sustainable technology sector, which is seeing 35% growth annually.",
    relevance_score: 0.85
  },
  {
    type: "job_match",
    recommendation: "With your experience, you're ideally suited for Sustainable Technology Consultant roles at firms focused on green infrastructure.",
    relevance_score: 0.88
  }
];

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

    // Get a random recommendation
    const randomIndex = Math.floor(Math.random() * sampleRecommendations.length)
    const recommendation = sampleRecommendations[randomIndex]

    // Insert the recommendation
    const { data, error } = await supabaseClient
      .from('career_recommendations')
      .insert({
        user_id: user.id,
        type: recommendation.type,
        recommendation: recommendation.recommendation,
        relevance_score: recommendation.relevance_score,
        status: 'pending'
      })

    if (error) throw error

    // Log user activity
    await supabaseClient
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'career_twin_recommendation_generated',
        metadata: { recommendation_type: recommendation.type }
      })
      .catch(err => console.error("Failed to log activity:", err))

    return new Response(
      JSON.stringify({ success: true, data: recommendation }),
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
