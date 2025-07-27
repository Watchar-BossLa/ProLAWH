-- CRITICAL SECURITY FIX: Role escalation vulnerability and quiz table security

-- Fix 1: CRITICAL - Fix role escalation vulnerability in user_roles table
-- Remove the existing policy that allows users to insert their own roles
DROP POLICY IF EXISTS "Users can manage their own roles" ON public.user_roles;

-- Create secure admin-only role management
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Super admins can manage all user roles"
ON public.user_roles
FOR ALL
USING (has_user_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix 2: Add RLS policies for incorporation_status (no foreign table dependency)
CREATE POLICY "Admins can view all incorporation status"
ON public.incorporation_status
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update incorporation status"
ON public.incorporation_status
FOR UPDATE
USING (has_user_role(auth.uid(), 'admin'));

-- Fix 3: Enable RLS and add policies for quiz tables  
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quiz questions"
ON public.quiz_questions
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view quiz options"
ON public.quiz_options
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own quiz answers"
ON public.quiz_answers
FOR ALL
USING (auth.uid() = user_id);

-- Fix 4: Add security audit logging for role changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      event_details,
      ip_address,
      risk_score
    ) VALUES (
      'role_granted',
      jsonb_build_object(
        'user_id', NEW.user_id,
        'role', NEW.role,
        'granted_by', auth.uid()
      ),
      inet_client_addr()::text,
      CASE WHEN NEW.role = 'admin' THEN 8 ELSE 5 END
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      event_details,
      ip_address,
      risk_score
    ) VALUES (
      'role_revoked',
      jsonb_build_object(
        'user_id', OLD.user_id,
        'role', OLD.role,
        'revoked_by', auth.uid()
      ),
      inet_client_addr()::text,
      CASE WHEN OLD.role = 'admin' THEN 8 ELSE 5 END
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER role_changes_audit
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();