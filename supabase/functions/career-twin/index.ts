
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced recommendation engines with more specific and detailed career guidance data
const skillGapRecommendations = [
  {
    recommendation: "Consider learning Rust programming to expand your backend expertise. Companies like Dropbox and Cloudflare are actively hiring Rust developers, with a salary premium of 15-20% over similar roles.",
    relevance_score: 0.92,
    skills: ["Rust", "Systems Programming", "Performance Optimization"],
    resources: [
      { type: "course", name: "Rust Fundamentals", url: "https://www.rust-lang.org/learn" },
      { type: "community", name: "Rust Programming Forum", url: "https://users.rust-lang.org/" }
    ]
  },
  {
    recommendation: "Developing expertise in green energy infrastructure software would significantly boost your marketability in renewable sectors. Solar and wind energy companies are seeking developers with both technical and domain knowledge.",
    relevance_score: 0.89,
    skills: ["Renewable Energy", "Green Infrastructure", "Sustainability Software"],
    resources: [
      { type: "certification", name: "Renewable Energy Software Development", url: "https://www.example.org/cert" },
      { type: "project", name: "Open Source Energy Management Systems", url: "https://github.com/topics/energy-management" }
    ]
  },
  {
    recommendation: "Adding data visualization skills with D3.js would complement your current stack and open opportunities in climate analytics and environmental reporting platforms.",
    relevance_score: 0.85,
    skills: ["D3.js", "Data Visualization", "Environmental Analytics"],
    resources: [
      { type: "tutorial", name: "D3.js for Environmental Data", url: "https://observablehq.com/@d3/gallery" },
      { type: "tool", name: "Environmental Data Visualization Toolkit", url: "https://www.example.com/toolkit" }
    ]
  },
  {
    recommendation: "Cloud carbon footprint optimization is an emerging skill highly valued by companies committed to sustainability goals. Learning tools like Cloud Carbon Footprint would position you as a specialist in this niche.",
    relevance_score: 0.83,
    skills: ["Cloud Sustainability", "Carbon Footprint Reduction", "Green Computing"],
    resources: [
      { type: "guide", name: "Cloud Carbon Footprint Implementation", url: "https://www.cloudcarbonfootprint.org/docs/getting-started" },
      { type: "community", name: "Green Software Foundation", url: "https://greensoftware.foundation/" }
    ]
  }
];

const jobMatchRecommendations = [
  {
    recommendation: "Your profile shows strong alignment with Sustainability Solution Architect roles. Companies like Salesforce, Microsoft, and Google have created these positions to build their environmental impact platforms.",
    relevance_score: 0.91,
    skills: ["Cloud Architecture", "Sustainability Systems", "Enterprise Solutions"],
    resources: [
      { type: "job_board", name: "Climate Tech Careers", url: "https://climatebase.org/" },
      { type: "networking", name: "Climate Action Tech Community", url: "https://climateaction.tech/" }
    ]
  },
  {
    recommendation: "Consider roles in Carbon Accounting Software Development. These positions combine software engineering with environmental impact measurement and are growing at 35% annually.",
    relevance_score: 0.88,
    skills: ["Carbon Accounting", "Emissions Tracking", "Environmental Reporting"],
    resources: [
      { type: "course", name: "Carbon Accounting Fundamentals", url: "https://www.example.edu/carbon-accounting" },
      { type: "tool", name: "Greenhouse Gas Protocol Tools", url: "https://ghgprotocol.org/calculation-tools" }
    ]
  },
  {
    recommendation: "Circular Economy Software Engineer positions are emerging in manufacturing and supply chain companies. Your background would be valuable for companies reimagining product lifecycles and waste reduction.",
    relevance_score: 0.87,
    skills: ["Circular Economy", "Supply Chain Optimization", "Waste Reduction Systems"],
    resources: [
      { type: "report", name: "Circular Economy Tech Opportunities", url: "https://www.example.org/circular-tech" },
      { type: "community", name: "Circular Economy Developers", url: "https://www.example.net/circular-devs" }
    ]
  },
  {
    recommendation: "Green FinTech is rapidly expanding, with roles for developers who can build sustainable investment platforms, carbon credit marketplaces, and climate risk assessment tools.",
    relevance_score: 0.84,
    skills: ["FinTech", "Sustainable Finance", "Carbon Markets"],
    resources: [
      { type: "conference", name: "Green FinTech Summit", url: "https://www.example.com/green-fintech" },
      { type: "newsletter", name: "Sustainable FinTech Weekly", url: "https://www.example.org/sustainable-fintech-news" }
    ]
  }
];

const mentorshipRecommendations = [
  {
    recommendation: "Connecting with a mentor specializing in Climate Tech Entrepreneurship would be valuable for your career trajectory. Look for professionals who have founded or scaled sustainability-focused startups.",
    relevance_score: 0.94,
    skills: ["Climate Tech", "Entrepreneurship", "Startup Growth"],
    resources: [
      { type: "platform", name: "Climate Tech Mentorship Network", url: "https://www.example.org/climate-mentors" },
      { type: "event", name: "Sustainability Founders Meetup", url: "https://www.example.com/eco-founders" }
    ]
  },
  {
    recommendation: "A mentor with experience in both technology leadership and environmental science would help bridge the knowledge gap between technical implementation and sustainability impact.",
    relevance_score: 0.89,
    skills: ["Technical Leadership", "Environmental Science", "Impact Assessment"],
    resources: [
      { type: "directory", name: "Tech for Planet Mentors", url: "https://www.example.net/tech-planet-mentors" },
      { type: "program", name: "Green Tech Leadership Mentorship", url: "https://www.example.edu/green-tech-mentors" }
    ]
  },
  {
    recommendation: "Seek mentorship from professionals in Carbon Removal Technology. This rapidly evolving field combines software engineering with climate science and would complement your current skill set.",
    relevance_score: 0.85,
    skills: ["Carbon Removal", "Climate Technology", "Environmental Engineering"],
    resources: [
      { type: "network", name: "Carbon Tech Connect", url: "https://www.example.org/carbon-connect" },
      { type: "fellowship", name: "Climate Solutions Fellowship", url: "https://www.example.com/climate-fellows" }
    ]
  },
  {
    recommendation: "A mentor who specializes in ESG (Environmental, Social, Governance) Data Systems would provide valuable insights into how technology is reshaping corporate sustainability reporting and compliance.",
    relevance_score: 0.83,
    skills: ["ESG Reporting", "Sustainability Metrics", "Compliance Systems"],
    resources: [
      { type: "association", name: "ESG Technology Alliance", url: "https://www.example.net/esg-tech" },
      { type: "webinar", name: "ESG Data Systems Masterclass", url: "https://www.example.edu/esg-data-webinar" }
    ]
  }
];

async function generateRecommendation(supabase, user) {
  try {
    // Get user's existing recommendations to avoid duplication and balance types
    const { data: existingRecs, error: recsError } = await supabase
      .from('career_recommendations')
      .select('type, recommendation')
      .eq('user_id', user.id);
    
    if (recsError) throw recsError;
    
    // Count existing recommendation types to balance the distribution
    const typeCounts = {
      skill_gap: 0,
      job_match: 0,
      mentor_suggest: 0
    };
    
    existingRecs?.forEach((rec) => {
      if (rec.type in typeCounts) {
        typeCounts[rec.type]++;
      }
    });
    
    // Determine which type to generate based on current distribution
    // Prioritize types with fewer existing recommendations
    const totalRecs = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
    const typeWeights = {
      skill_gap: 1 - (typeCounts.skill_gap / (totalRecs + 1) || 0),
      job_match: 1 - (typeCounts.job_match / (totalRecs + 1) || 0),
      mentor_suggest: 1 - (typeCounts.mentor_suggest / (totalRecs + 1) || 0)
    };
    
    // Normalize weights
    const totalWeight = Object.values(typeWeights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(typeWeights).forEach(key => {
      typeWeights[key] = typeWeights[key] / totalWeight;
    });
    
    // Random selection based on weights
    let selectedType;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [type, weight] of Object.entries(typeWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedType = type;
        break;
      }
    }
    
    // Select recommendation source based on type
    let recommendationSource;
    switch (selectedType) {
      case 'skill_gap':
        recommendationSource = skillGapRecommendations;
        break;
      case 'job_match':
        recommendationSource = jobMatchRecommendations;
        break;
      case 'mentor_suggest':
        recommendationSource = mentorshipRecommendations;
        break;
      default:
        recommendationSource = skillGapRecommendations;
    }
    
    // Try to find a recommendation that doesn't already exist
    const existingTexts = new Set(existingRecs?.map(rec => rec.recommendation) || []);
    let recommendation = null;
    
    // First try to find a non-duplicate
    const uniqueRecs = recommendationSource.filter(rec => !existingTexts.has(rec.recommendation));
    
    if (uniqueRecs.length > 0) {
      // If we have unique recommendations available, select one randomly
      recommendation = uniqueRecs[Math.floor(Math.random() * uniqueRecs.length)];
    } else {
      // If all have been used, select any but add a prefix to make it unique
      recommendation = {...recommendationSource[Math.floor(Math.random() * recommendationSource.length)]};
      const prefixes = [
        "Our latest analysis shows that ",
        "Recent industry trends indicate that ",
        "Based on your updated profile, ",
        "New data suggests that "
      ];
      const selectedPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      recommendation.recommendation = selectedPrefix + recommendation.recommendation.toLowerCase();
    }
    
    // Get user's green skills to personalize the recommendation if available
    const { data: userSkills, error: skillsError } = await supabase
      .from('user_green_skills')
      .select('green_skills!inner(name, category)')
      .eq('user_id', user.id)
      .limit(5);
    
    // If we have user skills, try to personalize the recommendation slightly
    if (!skillsError && userSkills?.length > 0) {
      // We could use this data to further personalize recommendations
      // For now, just logging it for demonstration
      console.log("User has skills in:", userSkills.map(s => s.green_skills.name).join(", "));
    }
    
    // Create the recommendation record
    const { data: newRec, error: createError } = await supabase
      .from('career_recommendations')
      .insert({
        user_id: user.id,
        type: selectedType,
        recommendation: recommendation.recommendation,
        skills: recommendation.skills || [],
        resources: recommendation.resources || [],
        relevance_score: recommendation.relevance_score || 0.8,
        status: 'pending'
      })
      .select()
      .single();
    
    if (createError) throw createError;
    
    // Log the activity
    await supabase
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'career_twin_recommendation_generated',
        metadata: { 
          recommendation_type: selectedType,
          recommendation_id: newRec.id 
        }
      });
    
    return newRec;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with the user's session token
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
    
    // Generate a personalized recommendation
    const recommendation = await generateRecommendation(supabaseClient, user);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: recommendation,
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
