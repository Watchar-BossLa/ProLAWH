-- Phase 1: Critical Security Hardening - Fix Database Security Issues (Final Fix)

-- 1. Enable RLS on public tables that don't have it
ALTER TABLE IF EXISTS public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.environmental_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.incorporation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_entity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_progress ENABLE ROW LEVEL SECURITY;

-- 2. Create missing tables
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

CREATE TABLE IF NOT EXISTS public.staking_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_address text NOT NULL,
  network text NOT NULL DEFAULT 'polygon',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE IF EXISTS public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staking_contracts ENABLE ROW LEVEL SECURITY;

-- 3. Create basic RLS policies for tables without them

-- Content templates policies
DROP POLICY IF EXISTS "Authenticated users can view templates" ON public.content_templates;
CREATE POLICY "Authenticated users can view templates" ON public.content_templates
  FOR SELECT TO authenticated USING (true);

-- Environmental achievements policies
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.environmental_achievements;
CREATE POLICY "Anyone can view achievements" ON public.environmental_achievements
  FOR SELECT USING (true);

-- Chat typing indicators policies
DROP POLICY IF EXISTS "Users can view typing indicators in their chats" ON public.chat_typing_indicators;
DROP POLICY IF EXISTS "Users can manage their own typing indicators" ON public.chat_typing_indicators;

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
DROP POLICY IF EXISTS "Users can view their own course progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can create their own course progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own course progress" ON public.course_progress;

CREATE POLICY "Users can view their own course progress" ON public.course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress" ON public.course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON public.course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User sessions policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Security audit logs policies
DROP POLICY IF EXISTS "System can insert security audit logs" ON public.security_audit_logs;
CREATE POLICY "System can insert security audit logs" ON public.security_audit_logs
  FOR INSERT WITH CHECK (true);

-- Staking contracts policies
DROP POLICY IF EXISTS "Anyone can view active staking contracts" ON public.staking_contracts;
CREATE POLICY "Anyone can view active staking contracts" ON public.staking_contracts
  FOR SELECT USING (active = true);

-- 4. Fix all database functions to have secure search_path

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
  WHERE created_at < now() - INTERVAL '90 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_active_staking_contracts()
RETURNS TABLE(id uuid, contract_address text, network text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id, contract_address, network
  FROM public.staking_contracts
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

-- 5. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);

-- Phase 1 Security Hardening Complete!
-- Fixed: RLS enabled on all public tables
-- Fixed: All functions have secure search_path
-- Fixed: Added proper RLS policies
-- Fixed: Created missing security tables