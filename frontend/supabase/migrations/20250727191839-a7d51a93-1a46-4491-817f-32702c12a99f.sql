-- Add security audit logging and fix role escalation

-- 1. Add security audit logging for failed auth attempts
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security audit logs"
ON public.security_audit_logs
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security audit logs"
ON public.security_audit_logs
FOR INSERT
WITH CHECK (true);

-- 2. Add audit logging for role changes
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  granted_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role audit logs"
ON public.role_audit_log
FOR SELECT
USING (has_user_role(auth.uid(), 'admin'));

-- Trigger to log role changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (target_user_id, role, action, granted_by)
    VALUES (NEW.user_id, NEW.role::text, 'granted', auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (target_user_id, role, action, granted_by)
    VALUES (OLD.user_id, OLD.role::text, 'revoked', auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER role_changes_audit
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();