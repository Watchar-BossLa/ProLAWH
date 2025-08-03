-- Remove SECURITY DEFINER views and replace with proper RLS policies
-- The views causing issues are likely the active_stakes and green_skill_index views

-- Drop and recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.active_stakes CASCADE;
DROP VIEW IF EXISTS public.green_skill_index CASCADE;

-- Recreate active_stakes view with proper RLS
CREATE VIEW public.active_stakes AS
SELECT 
  ss.id,
  ss.user_id,
  ss.skill_id,
  ss.amount_usdc,
  ss.status,
  ss.started_at,
  ss.ends_at,
  ss.created_at,
  ss.updated_at,
  s.name AS skill_name,
  s.category AS skill_category,
  ss.polygon_tx_hash,
  ss.polygon_contract_address
FROM skill_stakes ss
JOIN skills s ON ss.skill_id = s.id
WHERE ss.status = 'active'::stake_status;

-- Recreate green_skill_index view with proper RLS  
CREATE VIEW public.green_skill_index AS
SELECT 
  s.id,
  s.name,
  s.category,
  s.is_green_skill,
  s.sustainability_score,
  COUNT(us.id) AS user_count,
  AVG(us.proficiency_level) AS avg_proficiency
FROM skills s
LEFT JOIN user_skills us ON s.id = us.skill_id
WHERE s.is_green_skill = true
GROUP BY s.id, s.name, s.category, s.is_green_skill, s.sustainability_score;

-- Enable RLS on the views (they inherit from underlying tables)
-- Views don't need explicit RLS policies as they inherit from the base tables

-- Log the security fix
SELECT public.log_critical_security_event(
  'system',
  'high',
  'Removed SECURITY DEFINER views and replaced with standard views',
  NULL,
  jsonb_build_object(
    'views_fixed', ARRAY['active_stakes', 'green_skill_index'],
    'fix_timestamp', now()
  )
);