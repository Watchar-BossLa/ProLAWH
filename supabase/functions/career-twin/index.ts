
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { OpenAI } from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    // Get session from headers
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    const { data: { user } } = await supabase.auth.getUser(authHeader)

    if (!user) throw new Error('Not authenticated')

    // Get user activity logs
    const { data: activities } = await supabase
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get user skills
    const { data: skills } = await supabase
      .from('user_skills')
      .select('skills(*)')
      .eq('user_id', user.id)

    // Generate AI recommendation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI career advisor analyzing user activity and skills to provide career recommendations."
        },
        {
          role: "user",
          content: `Based on the following user data, provide a career development recommendation:
            Activities: ${JSON.stringify(activities)}
            Skills: ${JSON.stringify(skills)}`
        }
      ]
    })

    const recommendation = {
      type: 'skill_gap',
      recommendation: completion.choices[0].message.content,
      relevance_score: 0.95,
    }

    // Store recommendation
    const { error: insertError } = await supabase
      .from('career_recommendations')
      .insert([
        {
          user_id: user.id,
          ...recommendation,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        }
      ])

    if (insertError) throw insertError

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
