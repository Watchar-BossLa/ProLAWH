-- CRITICAL SECURITY FIXES - Phase 1: Database Security (Corrected)
-- Enable RLS on unprotected tables and create secure policies

-- 1. Enable RLS on quiz-related tables
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
CREATE POLICY "Admins can view all incorporation status"
ON public.incorporation_status
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update incorporation status"
ON public.incorporation_status
FOR UPDATE
USING (has_user_role(auth.uid(), 'admin'));

-- 3. Enhanced security audit logging table
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.security_audit_logs ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT false;

-- 4. Fix database function security - add proper search paths
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