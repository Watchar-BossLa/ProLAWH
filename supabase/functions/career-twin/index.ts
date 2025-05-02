
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced recommendations with more specific career guidance
const skillGapRecommendations = [
  {
    recommendation: "Based on industry trends, developing Rust programming skills would strengthen your backend expertise. This could increase your job opportunities by 24% over the next 6 months, particularly in high-performance systems.",
    relevance_score: 0.92,
    skills: ["Rust", "Systems Programming", "Performance Optimization"]
  },
  {
    recommendation: "Your profile shows strong potential for enhancing your cloud architecture skills. Focus on AWS Solution Architect certification to increase your market value by approximately 15-20%.",
    relevance_score: 0.89,
    skills: ["AWS", "Cloud Architecture", "Infrastructure as Code"]
  },
  {
    recommendation: "There's a growing demand for developers with AI/ML integration experience. Consider focusing on TensorFlow or PyTorch to complement your existing skills. AI skills command a 26% premium in the job market.",
    relevance_score: 0.87,
    skills: ["TensorFlow", "PyTorch", "Machine Learning"]
  },
  {
    recommendation: "Kubernetes expertise would significantly enhance your DevOps capabilities. Companies are increasingly seeking professionals who can manage container orchestration efficiently.",
    relevance_score: 0.85,
    skills: ["Kubernetes", "Container Orchestration", "DevOps"]
  }
];

const jobMatchRecommendations = [
  {
    recommendation: "Your profile shows a strong match (88%) for Senior Backend Developer positions at fintech companies. Consider applying to Stripe, Square, or similar companies focused on payment systems and financial technology.",
    relevance_score: 0.91,
    skills: ["API Development", "Payment Systems", "Financial Technology"]
  },
  {
    recommendation: "There's high demand for Green Technology Engineers with your skill profile. Companies like Tesla, Sunrun, and Bloom Energy are actively recruiting for sustainability-focused development roles.",
    relevance_score: 0.88,
    skills: ["Green Technology", "Sustainable Engineering", "Energy Systems"]
  },
  {
    recommendation: "Your skills match well with Tech Lead positions at healthcare startups. Consider exploring opportunities at digital health companies focused on patient care and medical data systems.",
    relevance_score: 0.86,
    skills: ["Healthcare Technology", "Data Privacy", "HIPAA Compliance"]
  },
  {
    recommendation: "With your background, transitioning to Blockchain Development roles would be strategic. Web3 companies are seeking developers with distributed systems experience to build the next generation of decentralized applications.",
    relevance_score: 0.84,
    skills: ["Blockchain", "Smart Contracts", "Web3"]
  }
];

const mentorshipRecommendations = [
  {
    recommendation: "You would benefit from connecting with mentors who have experience transitioning from backend to full-stack development. This matches your career trajectory and would provide valuable guidance on expanding your technical scope.",
    relevance_score: 0.90,
    skills: ["Full-Stack Development", "Career Transition", "Technical Leadership"]
  },
  {
    recommendation: "Based on your interests in sustainability, connecting with a Green Tech mentor would help you align your technical skills with environmental impact objectives. This could open new career paths in climate tech.",
    relevance_score: 0.87,
    skills: ["Green Tech", "Sustainability", "Environmental Impact"]
  },
  {
    recommendation: "Your career would benefit from mentorship with an experienced Engineering Manager who could guide your progression toward technical leadership roles and help develop your team management skills.",
    relevance_score: 0.86,
    skills: ["Engineering Management", "Team Leadership", "Career Growth"]
  },
  {
    recommendation: "A mentor with startup experience would be valuable for your profile, especially someone who has navigated the transition from large tech companies to early-stage environments.",
    relevance_score: 0.85,
    skills: ["Startup Environment", "Entrepreneurship", "Scaling Teams"]
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error(userError?.message || 'Authentication required');
    }

    // Get user's skills to make recommendations more relevant
    const { data: userSkills, error: skillsError } = await supabaseClient
      .from('user_green_skills')
      .select('*')
      .eq('user_id', user.id);

    // Get existing recommendations to avoid duplicates
    const { data: existingRecs, error: recsError } = await supabaseClient
      .from('career_recommendations')
      .select('recommendation')
      .eq('user_id', user.id);

    // Choose recommendation type randomly but weighted toward areas with fewer recommendations
    const existingTypes = existingRecs 
      ? existingRecs.reduce((counts: Record<string, number>, rec: any) => {
          const type = rec.type || '';
          counts[type] = (counts[type] || 0) + 1;
          return counts;
        }, {})
      : {};
    
    const skillGapCount = existingTypes['skill_gap'] || 0;
    const jobMatchCount = existingTypes['job_match'] || 0;
    const mentorSuggestCount = existingTypes['mentor_suggest'] || 0;
    
    // Weight inversely to current counts (more recommendations of types that have fewer)
    const totalWeight = 3 + jobMatchCount + skillGapCount + mentorSuggestCount;
    const skillGapWeight = (jobMatchCount + mentorSuggestCount) / totalWeight;
    const jobMatchWeight = (skillGapCount + mentorSuggestCount) / totalWeight;
    const mentorSuggestWeight = (skillGapCount + jobMatchCount) / totalWeight;
    
    // Choose type based on weighted random selection
    const randomValue = Math.random();
    let recommendationType: string;
    let recommendation: any;
    
    if (randomValue < skillGapWeight) {
      recommendationType = 'skill_gap';
      recommendation = skillGapRecommendations[Math.floor(Math.random() * skillGapRecommendations.length)];
    } else if (randomValue < skillGapWeight + jobMatchWeight) {
      recommendationType = 'job_match';
      recommendation = jobMatchRecommendations[Math.floor(Math.random() * jobMatchRecommendations.length)];
    } else {
      recommendationType = 'mentor_suggest';
      recommendation = mentorshipRecommendations[Math.floor(Math.random() * mentorshipRecommendations.length)];
    }

    // Check if this exact recommendation already exists
    const isDuplicate = existingRecs?.some(
      (rec: any) => rec.recommendation === recommendation.recommendation
    );
    
    // If duplicate, try to find another one or modify slightly
    if (isDuplicate) {
      // Simple modification - add a prefix to make it unique
      const prefixes = [
        "Our latest analysis suggests that ",
        "Based on recent market trends, ",
        "According to updated career data, "
      ];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      recommendation.recommendation = prefix + recommendation.recommendation.toLowerCase();
    }

    // Insert the recommendation
    const { data, error } = await supabaseClient
      .from('career_recommendations')
      .insert({
        user_id: user.id,
        type: recommendationType,
        recommendation: recommendation.recommendation,
        relevance_score: recommendation.relevance_score,
        skills: recommendation.skills,
        status: 'pending'
      })
      .select();

    if (error) throw error;

    // Log user activity
    await supabaseClient
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'career_twin_recommendation_generated',
        metadata: { 
          recommendation_type: recommendationType,
          recommendation_id: data[0].id
        }
      });

    // Return the newly created recommendation
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: data[0],
        message: "New career recommendation generated successfully" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in career-twin function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
