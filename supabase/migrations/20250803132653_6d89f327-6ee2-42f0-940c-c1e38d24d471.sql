-- Fix critical security issues identified in security review

-- 1. Fix function search path vulnerabilities for existing security functions
ALTER FUNCTION public.monitor_session_security() SET search_path = 'public';
ALTER FUNCTION public.cleanup_old_security_events() SET search_path = 'public';
ALTER FUNCTION public.check_rate_limit(text, text, integer, integer) SET search_path = 'public';

-- 2. Enhanced security for all user-defined functions
ALTER FUNCTION public.has_user_role(uuid, text) SET search_path = 'public';
ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
ALTER FUNCTION public.is_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.has_admin_role(uuid, text) SET search_path = 'public';

-- 3. Add security event tracking for critical operations
CREATE OR REPLACE FUNCTION public.log_critical_security_event(
  p_event_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_metadata JSONB DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  INSERT INTO public.security_events (
    user_id,
    event_type,
    severity,
    description,
    ip_address,
    user_agent,
    risk_score,
    metadata,
    flags
  ) VALUES (
    p_user_id,
    p_event_type,
    p_severity,
    p_description,
    'server-side',
    'database-function',
    CASE p_severity
      WHEN 'critical' THEN 10
      WHEN 'high' THEN 8
      WHEN 'medium' THEN 5
      ELSE 2
    END,
    p_metadata,
    ARRAY['database_function', p_event_type]
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 4. Add trigger to monitor sensitive table access
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive tables
  IF TG_TABLE_NAME IN ('security_events', 'ip_whitelist', 'rate_limits', 'admin_users') THEN
    PERFORM public.log_critical_security_event(
      'data_access',
      'medium',
      format('Access to sensitive table: %s', TG_TABLE_NAME),
      auth.uid(),
      jsonb_build_object(
        'table_name', TG_TABLE_NAME,
        'operation', TG_OP,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_security_events_access ON public.security_events;
CREATE TRIGGER audit_security_events_access
  AFTER INSERT OR UPDATE OR DELETE ON public.security_events
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_admin_users_access ON public.admin_users;  
CREATE TRIGGER audit_admin_users_access
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

-- 5. Enhanced session security tracking
CREATE TABLE IF NOT EXISTS public.security_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_token_hash TEXT NOT NULL,
  fingerprint_hash TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours'),
  is_suspicious BOOLEAN DEFAULT false,
  security_flags TEXT[] DEFAULT '{}',
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 10)
);

-- Enable RLS for security sessions
ALTER TABLE public.security_sessions ENABLE ROW LEVEL SECURITY;

-- Security sessions policies
CREATE POLICY "Users can view their own security sessions"
ON public.security_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security sessions"
ON public.security_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security sessions"
ON public.security_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security sessions"
ON public.security_sessions 
FOR SELECT 
USING (has_user_role(auth.uid(), 'admin'));

-- Index for performance
CREATE INDEX idx_security_sessions_user_id ON public.security_sessions(user_id);
CREATE INDEX idx_security_sessions_expires_at ON public.security_sessions(expires_at);
CREATE INDEX idx_security_sessions_suspicious ON public.security_sessions(is_suspicious) WHERE is_suspicious = true;

-- 6. Function to clean up expired security sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_security_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.security_sessions 
  WHERE expires_at < now();
  
  -- Log cleanup operation
  PERFORM public.log_critical_security_event(
    'system',
    'low',
    'Cleaned up expired security sessions',
    NULL,
    jsonb_build_object('cleanup_timestamp', now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';