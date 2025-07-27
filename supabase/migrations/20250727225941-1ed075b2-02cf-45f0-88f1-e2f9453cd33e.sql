-- CRITICAL SECURITY FIXES - Phase 1: Database Security
-- Fix all RLS vulnerabilities and security definer functions

-- 1. Enable RLS on unprotected tables and create secure policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz policies - only authenticated users can view, admins can manage
CREATE POLICY "Authenticated users can view quizzes"
ON public.quizzes
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage quizzes"
ON public.quizzes
FOR ALL
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view quiz questions"
ON public.quiz_questions
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage quiz questions"
ON public.quiz_questions
FOR ALL
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view quiz options"
ON public.quiz_options
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage quiz options"
ON public.quiz_options
FOR ALL
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their own quiz attempts"
ON public.quiz_attempts
FOR ALL
USING (auth.uid() = user_id);

-- 2. Fix incorporation_status table security
ALTER TABLE public.incorporation_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all incorporation status"
ON public.incorporation_status
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update incorporation status"
ON public.incorporation_status
FOR UPDATE
USING (has_user_role(auth.uid(), 'admin'));

-- 3. Add missing policies for tables with RLS enabled but no policies
CREATE POLICY "Users can view their own green skill index"
ON public.green_skill_index
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own active stakes"
ON public.active_stakes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own active stakes"
ON public.active_stakes
FOR ALL
USING (auth.uid() = user_id);

-- 4. Create missing role_audit_log table with proper structure
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  granted_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role audit logs"
ON public.role_audit_log
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert role audit logs"
ON public.role_audit_log
FOR INSERT
WITH CHECK (true);

-- 5. Fix database function security - add proper search paths
CREATE OR REPLACE FUNCTION public.has_user_role(check_user_id uuid, check_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role::text = check_role
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role::text FROM public.user_roles WHERE user_id = check_user_id LIMIT 1;
$function$;

-- Update all other security definer functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_admin_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND role = required_role
  );
END;
$function$;

-- 6. Enhanced role change logging with security context
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (
      target_user_id, 
      role, 
      action, 
      granted_by,
      ip_address,
      user_agent,
      metadata
    ) VALUES (
      NEW.user_id, 
      NEW.role::text, 
      'granted', 
      auth.uid(),
      inet_client_addr()::text,
      current_setting('request.headers')::json->>'user-agent',
      jsonb_build_object(
        'timestamp', now(),
        'table_operation', 'INSERT',
        'session_id', current_setting('request.headers')::json->>'authorization'
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (
      target_user_id, 
      role, 
      action, 
      granted_by,
      ip_address,
      user_agent,
      metadata
    ) VALUES (
      OLD.user_id, 
      OLD.role::text, 
      'revoked', 
      auth.uid(),
      inet_client_addr()::text,
      current_setting('request.headers')::json->>'user-agent',
      jsonb_build_object(
        'timestamp', now(),
        'table_operation', 'DELETE',
        'session_id', current_setting('request.headers')::json->>'authorization'
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger if it exists
DROP TRIGGER IF EXISTS role_changes_audit ON public.user_roles;
CREATE TRIGGER role_changes_audit
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- 7. Enhanced security audit logging table
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT false;

-- 8. Create IP whitelist security table
CREATE TABLE IF NOT EXISTS public.ip_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage IP whitelist"
ON public.ip_whitelist
FOR ALL
USING (has_user_role(auth.uid(), 'admin'));

-- 9. Function to validate admin operations from whitelisted IPs
CREATE OR REPLACE FUNCTION public.validate_admin_ip()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Allow if no whitelist entries exist (backward compatibility)
  IF NOT EXISTS (SELECT 1 FROM public.ip_whitelist WHERE is_active = true) THEN
    RETURN true;
  END IF;
  
  -- Check if current IP is whitelisted
  RETURN EXISTS (
    SELECT 1 FROM public.ip_whitelist 
    WHERE ip_address >>= inet_client_addr() 
    AND is_active = true
  );
END;
$function$;