
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define types to ensure consistent data structure
interface CareerRecommendation {
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest' | 'learning_path';
  recommendation: string;
  relevance_score: number;
  status: 'pending';
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
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
    type: "learning_path",
    recommendation: "To reach your career goal of becoming a Technical Lead, focus on developing architectural design skills and team leadership experience.",
    relevance_score: 0.85
  },
  {
    type: "skill_gap", 
    recommendation: "Adding GraphQL expertise to your skill set would complement your existing REST API knowledge and make you more attractive to modern tech companies.",
    relevance_score: 0.88
  },
  {
    type: "job_match",
    recommendation: "With your background in cloud infrastructure, you're well-positioned for Cloud Architecture roles. AWS Solution Architect certification could be your next step.",
    relevance_score: 0.91
  },
  {
    type: "mentor_suggest",
    recommendation: "Finding a mentor with product management experience would help you bridge the gap between technical implementation and business requirements.",
    relevance_score: 0.82
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Career Twin function invoked");
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      console.log("Unauthorized access attempt");
      return new Response(
        JSON.stringify({ error: "You must be logged in to use this feature" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Get a random recommendation for demo purposes
    // In production, this would use an AI model based on user data
    const randomIndex = Math.floor(Math.random() * sampleRecommendations.length);
    const recommendationTemplate = sampleRecommendations[randomIndex];

    // Create the recommendation object
    const recommendation: CareerRecommendation = {
      user_id: user.id,
      type: recommendationTemplate.type as any,
      recommendation: recommendationTemplate.recommendation,
      relevance_score: recommendationTemplate.relevance_score,
      status: 'pending',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    console.log("Generating recommendation:", recommendation.type);

    // Insert the recommendation
    const { data, error } = await supabaseClient
      .from('career_recommendations')
      .insert(recommendation);

    if (error) {
      console.error("Error inserting recommendation:", error);
      throw error;
    }

    // Log user activity
    await supabaseClient
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'career_twin_recommendation_generated',
        metadata: { 
          recommendation_type: recommendation.type,
          timestamp: new Date().toISOString()
        }
      })
      .catch(error => console.error("Failed to log activity:", error));

    console.log("Recommendation successfully generated");
    
    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Career Twin error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
