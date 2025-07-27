
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

    const webhookData = await req.json()
    const { type, user_id, data } = webhookData

    if (!user_id || !type || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    switch (type) {
      case 'session_completed':
        await handleSessionCompleted(supabaseClient, user_id, data)
        break
      case 'progress_update':
        await handleProgressUpdate(supabaseClient, user_id, data)
        break
      case 'achievement_earned':
        await handleAchievementEarned(supabaseClient, user_id, data)
        break
      default:
        console.log('Unknown webhook type:', type)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleSessionCompleted(supabaseClient: any, user_id: string, sessionData: any) {
  const { error } = await supabaseClient
    .from('study_bee_sessions')
    .insert({
      user_id,
      session_id: sessionData.session_id,
      session_type: sessionData.type,
      subject: sessionData.subject,
      duration_minutes: sessionData.duration_minutes,
      progress_percentage: sessionData.progress_percentage,
      notes_count: sessionData.notes_count || 0,
      quiz_score: sessionData.quiz_score,
      started_at: sessionData.started_at,
      completed_at: sessionData.completed_at,
      metadata: sessionData.metadata || {}
    })

  if (error) {
    console.error('Error saving session:', error)
    throw error
  }
}

async function handleProgressUpdate(supabaseClient: any, user_id: string, progressData: any) {
  const { error } = await supabaseClient
    .from('study_bee_progress')
    .upsert({
      user_id,
      total_study_time: progressData.total_study_time,
      sessions_this_week: progressData.sessions_this_week,
      current_streak: progressData.current_streak,
      longest_streak: progressData.longest_streak,
      subjects_studied: progressData.subjects_studied,
      achievements: progressData.achievements,
      performance_metrics: progressData.performance_metrics,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error updating progress:', error)
    throw error
  }
}

async function handleAchievementEarned(supabaseClient: any, user_id: string, achievementData: any) {
  // Store achievement and potentially trigger ProLawh notifications
  const { error } = await supabaseClient
    .from('user_activity_logs')
    .insert({
      user_id,
      activity_type: 'study_bee_achievement',
      metadata: {
        achievement_name: achievementData.name,
        achievement_type: achievementData.type,
        earned_at: achievementData.earned_at
      }
    })

  if (error) {
    console.error('Error logging achievement:', error)
    throw error
  }
}
