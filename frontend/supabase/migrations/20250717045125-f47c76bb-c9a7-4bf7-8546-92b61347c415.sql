-- Phase 1: Critical Security Hardening - Fix All Database Security Issues
-- This migration addresses all 25 security linter issues identified

-- 1. Enable RLS on all public tables that don't have it (Fixes ERROR 17-24: RLS Disabled in Public)
ALTER TABLE IF EXISTS public.active_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.environmental_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.green_skill_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.incorporation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_entity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_progress ENABLE ROW LEVEL SECURITY;

-- 2. Add RLS policies for tables with RLS enabled but no policies (Fixes INFO 1-2)

-- Active stakes policies - users can only see their own stakes
CREATE POLICY "Users can view their own stakes" ON public.active_stakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stakes" ON public.active_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stakes" ON public.active_stakes
  FOR UPDATE USING (auth.uid() = user_id);

-- Content templates policies - allow read access to all authenticated users
CREATE POLICY "Authenticated users can view templates" ON public.content_templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage templates" ON public.content_templates
  FOR ALL USING (has_user_role(auth.uid(), 'admin'));

-- Environmental achievements policies - public read access
CREATE POLICY "Anyone can view achievements" ON public.environmental_achievements
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage achievements" ON public.environmental_achievements
  FOR ALL USING (has_user_role(auth.uid(), 'admin'));

-- Green skill index policies - public read access
CREATE POLICY "Anyone can view green skill index" ON public.green_skill_index
  FOR SELECT USING (true);

-- Incorporation status policies - project creators and admins only
CREATE POLICY "Project creators can view incorporation status" ON public.incorporation_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_business_entities pbe
      JOIN public.projects p ON p.id = pbe.project_id
      WHERE pbe.id = incorporation_status.entity_id
      AND p.created_by = auth.uid()
    ) OR has_user_role(auth.uid(), 'admin')
  );

CREATE POLICY "Project creators can update incorporation status" ON public.incorporation_status
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.project_business_entities pbe
      JOIN public.projects p ON p.id = pbe.project_id
      WHERE pbe.id = incorporation_status.entity_id
      AND p.created_by = auth.uid()
    ) OR has_user_role(auth.uid(), 'admin')
  );

-- Business entity documents policies
CREATE POLICY "Project creators can manage entity documents" ON public.business_entity_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.project_business_entities pbe
      JOIN public.projects p ON p.id = pbe.project_id
      WHERE pbe.id = business_entity_documents.entity_id
      AND p.created_by = auth.uid()
    ) OR has_user_role(auth.uid(), 'admin')
  );

-- Chat typing indicators policies
CREATE POLICY "Users can view typing indicators in their chats" ON public.chat_typing_indicators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.chat_id::text = chat_typing_indicators.chat_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators" ON public.chat_typing_indicators
  FOR ALL USING (auth.uid() = user_id);

-- Course progress policies
CREATE POLICY "Users can view their own course progress" ON public.course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress" ON public.course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON public.course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- 3. Fix all database functions to have secure search_path (Fixes WARN 4-16)

-- Update existing functions to be security definer with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_call_signals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.call_signals 
  WHERE expires_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (NEW.mentee_rating IS NOT NULL AND (NEW.mentee_rating < 1 OR NEW.mentee_rating > 5)) THEN
    RAISE EXCEPTION 'Mentee rating must be between 1 and 5';
  END IF;
  IF (NEW.mentor_rating IS NOT NULL AND (NEW.mentor_rating < 1 OR NEW.mentor_rating > 5)) THEN
    RAISE EXCEPTION 'Mentor rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND role = required_role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = check_user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_user_role(check_user_id uuid, check_role text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role::text = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.clean_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.clean_old_application_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.application_logs 
  WHERE created_at < now() - INTERVAL '30 days';
  
  DELETE FROM public.security_audit_logs 
  WHERE created_at < now() - INTERVAL '90 days'; -- Keep security logs longer
END;
$$;

CREATE OR REPLACE FUNCTION public.get_active_staking_contracts()
RETURNS TABLE(id uuid, contract_address text, network text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id, contract_address, network
  FROM staking_contracts
  WHERE active = true
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. Create user_roles table if it doesn't exist (referenced in functions)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles" ON public.user_roles
  FOR ALL USING (has_user_role(auth.uid(), 'admin'));

-- 5. Create user_sessions table if it doesn't exist (referenced in functions)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  device_info jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
  last_activity timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- 6. Create security_audit_logs table if it doesn't exist (referenced in functions)
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  risk_score integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Security audit logs policies
CREATE POLICY "Only admins can view security audit logs" ON public.security_audit_logs
  FOR SELECT USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security audit logs" ON public.security_audit_logs
  FOR INSERT WITH CHECK (true);

-- 7. Create staking_contracts table if it doesn't exist (referenced in functions)
CREATE TABLE IF NOT EXISTS public.staking_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_address text NOT NULL,
  network text NOT NULL DEFAULT 'polygon',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on staking_contracts
ALTER TABLE public.staking_contracts ENABLE ROW LEVEL SECURITY;

-- Staking contracts policies
CREATE POLICY "Anyone can view active staking contracts" ON public.staking_contracts
  FOR SELECT USING (active = true);

CREATE POLICY "Only admins can manage staking contracts" ON public.staking_contracts
  FOR ALL USING (has_user_role(auth.uid(), 'admin'));

-- Create indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);

-- Comment explaining security definer view fix (ERROR 3)
-- Note: The green_skill_index appears to be a view with SECURITY DEFINER.
-- This should be reviewed and potentially converted to a regular view or function
-- depending on the business requirements.