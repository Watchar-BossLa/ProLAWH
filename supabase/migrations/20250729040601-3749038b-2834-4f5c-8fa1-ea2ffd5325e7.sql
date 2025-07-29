-- CRITICAL SECURITY FIXES - Phase 1: Database Security (Fixed)

-- 1. Fix potential data exposure in green_skill_index (currently has no RLS)
ALTER TABLE public.green_skill_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Green skill index is publicly viewable"
ON public.green_skill_index
FOR SELECT
USING (true);

-- 2. Strengthen user_roles security - prevent self-role assignment
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Create more restrictive policies
CREATE POLICY "Users can view their own roles only"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only super admins can manage roles
CREATE POLICY "Super admins can manage all user roles"
ON public.user_roles
FOR ALL
USING (has_user_role(auth.uid(), 'super_admin'));

-- Regular admins can only view roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_user_role(auth.uid(), 'admin') OR has_user_role(auth.uid(), 'super_admin'));

-- 3. Add critical security logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  severity TEXT,
  event_data JSONB DEFAULT '{}',
  user_id_override UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    severity,
    user_id,
    ip_address,
    user_agent,
    event_data,
    created_at
  ) VALUES (
    event_type,
    severity,
    COALESCE(user_id_override, auth.uid()),
    inet_client_addr()::text,
    current_setting('request.headers', true)::json->>'user-agent',
    event_data,
    now()
  );
END;
$$;

-- 4. Add rate limiting table for security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address TEXT,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true);

-- 5. Create IP whitelist table for enhanced security
CREATE TABLE IF NOT EXISTS public.ip_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage IP whitelist"
ON public.ip_whitelist
FOR ALL
USING (has_user_role(auth.uid(), 'admin'));

-- 6. Cleanup function for security logs (prevent unbounded growth)
CREATE OR REPLACE FUNCTION public.cleanup_security_logs()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Keep only last 6 months of security logs
  DELETE FROM public.security_audit_logs 
  WHERE created_at < now() - INTERVAL '6 months';
  
  -- Keep only last 7 days of rate limit data
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '7 days';
END;
$$;