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
  },
  {
    recommendation: "Given your interest in green skills, learning about carbon footprint calculation and sustainability metrics would be valuable. These skills are increasingly required in tech companies with ESG initiatives.",
    relevance_score: 0.91,
    skills: ["Carbon Accounting", "ESG", "Sustainability Metrics"]
  },
  {
    recommendation: "Based on your activity, enhancing your knowledge of blockchain for sustainability applications would align well with your interests. Focus on energy-efficient consensus algorithms and carbon credit tokenization.",
    relevance_score: 0.88,
    skills: ["Blockchain", "Carbon Credits", "Sustainable Finance"]
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
  },
  {
    recommendation: "Based on your recent activity, you would be a strong match for Sustainable Tech Consultant roles. Companies are looking for technical experts who can guide their green technology initiatives and ESG compliance.",
    relevance_score: 0.90,
    skills: ["Sustainability Consulting", "Green Tech", "ESG Strategy"]
  },
  {
    recommendation: "Your activity shows interest in educational technology. Consider EdTech Product Manager roles that would let you combine your technical skills with making an impact on learning outcomes.",
    relevance_score: 0.87,
    skills: ["EdTech", "Product Management", "Learning Platforms"]
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
  },
  {
    recommendation: "Based on your recent learning activities, connecting with a mentor specializing in sustainable infrastructure would provide valuable insights for your skill development in green technologies.",
    relevance_score: 0.89,
    skills: ["Sustainable Infrastructure", "Green Building", "Energy Efficiency"]
  },
  {
    recommendation: "Your activity suggests interest in data-driven decision making. A mentor with experience in data science for sustainability could help guide your learning path in this emerging field.",
    relevance_score: 0.88,
    skills: ["Data Science", "Sustainability Metrics", "Impact Measurement"]
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

    // Get user's activity logs to make recommendations more relevant
    const { data: userActivities, error: activitiesError } = await supabaseClient
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (activitiesError) {
      console.error('Error fetching user activities:', activitiesError);
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

    // Choose recommendation type based on user activity patterns
    // For example, if user has been viewing lots of courses, suggest skill development
    let recommendationType = 'skill_gap'; // Default
    
    if (userActivities && userActivities.length > 0) {
      const activityTypes = userActivities.map(a => a.activity_type);
      
      // Count occurrences of different activity types
      const networkInteractions = activityTypes.filter(t => t.includes('network')).length;
      const learningInteractions = activityTypes.filter(t => t.includes('learning')).length;
      const opportunityInteractions = activityTypes.filter(t => t.includes('opportunit')).length;
      
      // Determine recommendation type based on dominant activity
      if (networkInteractions > learningInteractions && networkInteractions > opportunityInteractions) {
        recommendationType = 'mentor_suggest';
      } else if (opportunityInteractions > learningInteractions) {
        recommendationType = 'job_match';
      }
    }
    
    // Existing type counts - weight toward underrepresented types
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
    
    // If we have a high imbalance, adjust the recommendation type
    const totalRecs = skillGapCount + jobMatchCount + mentorSuggestCount;
    if (totalRecs > 5) {
      // Find the least recommended type
      if (skillGapCount <= jobMatchCount && skillGapCount <= mentorSuggestCount) {
        recommendationType = 'skill_gap';
      } else if (jobMatchCount <= skillGapCount && jobMatchCount <= mentorSuggestCount) {
        recommendationType = 'job_match';
      } else {
        recommendationType = 'mentor_suggest';
      }
    }

    // Get the appropriate recommendation pool based on type
    let recommendationPool;
    switch (recommendationType) {
      case 'skill_gap':
        recommendationPool = skillGapRecommendations;
        break;
      case 'job_match':
        recommendationPool = jobMatchRecommendations;
        break;
      case 'mentor_suggest':
        recommendationPool = mentorshipRecommendations;
        break;
      default:
        recommendationPool = skillGapRecommendations;
    }

    // Choose a recommendation, with activity-based targeting
    let recommendation;
    if (userActivities && userActivities.length > 0) {
      // Look for specific activities and match to relevant recommendations
      const hasSustainabilityInterest = userActivities.some(a => 
        a.activity_type.includes('green') || 
        a.activity_type.includes('sustain') ||
        (a.metadata?.path && (
          a.metadata.path.includes('green') || 
          a.metadata.path.includes('sustain')
        ))
      );
      
      if (hasSustainabilityInterest) {
        // Filter for sustainability-focused recommendations
        const sustainabilityRecs = recommendationPool.filter(rec => 
          rec.recommendation.toLowerCase().includes('green') || 
          rec.recommendation.toLowerCase().includes('sustain') ||
          rec.skills.some(skill => 
            skill.toLowerCase().includes('green') || 
            skill.toLowerCase().includes('sustain')
          )
        );
        
        if (sustainabilityRecs.length > 0) {
          recommendation = sustainabilityRecs[Math.floor(Math.random() * sustainabilityRecs.length)];
        }
      }
    }
    
    // If no targeted recommendation was chosen, pick a random one
    if (!recommendation) {
      recommendation = recommendationPool[Math.floor(Math.random() * recommendationPool.length)];
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
        "According to updated career data, ",
        "Your recent activity indicates "
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
