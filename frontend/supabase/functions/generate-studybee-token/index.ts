
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a secure token for Study Bee authentication
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours

    // Store the token in the database
    const { error } = await supabaseClient
      .from('study_bee_auth_tokens')
      .upsert({
        user_id,
        token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        token,
        expires_at: expiresAt.toISOString(),
        studybee_url: `https://www.studybee.info/sso?token=${token}&return_to=dashboard`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
