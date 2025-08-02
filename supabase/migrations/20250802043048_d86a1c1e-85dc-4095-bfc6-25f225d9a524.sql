-- Enhanced security audit logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 10),
  metadata JSONB DEFAULT '{}',
  flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Security events policies
CREATE POLICY "Users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_event_type ON public.security_events(event_type);

-- IP whitelist for enhanced security
CREATE TABLE IF NOT EXISTS public.ip_whitelist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;

-- IP whitelist policies
CREATE POLICY "Admins can manage IP whitelist" 
ON public.ip_whitelist 
FOR ALL 
USING (has_user_role(auth.uid(), 'admin'));

-- Enhanced user_sessions table with additional security fields
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 10),
ADD COLUMN IF NOT EXISTS is_suspicious BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS security_flags TEXT[] DEFAULT '{}';

-- Session security monitoring function
CREATE OR REPLACE FUNCTION public.monitor_session_security()
RETURNS TRIGGER AS $$
BEGIN
  -- Log session creation
  INSERT INTO public.security_events (
    user_id, 
    event_type, 
    severity, 
    description, 
    ip_address,
    metadata
  ) VALUES (
    NEW.user_id,
    'authentication',
    'low',
    'New session created',
    NEW.ip_address,
    jsonb_build_object(
      'device_id', NEW.device_id,
      'browser', NEW.browser,
      'device_type', NEW.device_type
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for session monitoring
DROP TRIGGER IF EXISTS trigger_monitor_session_security ON public.user_sessions;
CREATE TRIGGER trigger_monitor_session_security
  AFTER INSERT ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.monitor_session_security();

-- Function to clean old security events
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS void AS $$
BEGIN
  -- Keep only last 90 days of security events
  DELETE FROM public.security_events 
  WHERE created_at < now() - INTERVAL '90 days';
  
  -- Keep only last 30 days of low severity events
  DELETE FROM public.security_events 
  WHERE severity = 'low' AND created_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP, user_id, or other identifier
  action_type TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  window_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 hour'),
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(identifier, action_type, window_start)
);

-- Rate limiting policies
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- Index for rate limiting performance
CREATE INDEX idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX idx_rate_limits_window ON public.rate_limits(window_start, window_end);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start_time := date_trunc('hour', now());
  
  -- Get current count for this window
  SELECT COALESCE(request_count, 0) INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start = window_start_time;
  
  -- If no record exists or within limit, allow and increment
  IF current_count < p_max_requests THEN
    INSERT INTO public.rate_limits (identifier, action_type, request_count, window_start, window_end)
    VALUES (p_identifier, p_action_type, 1, window_start_time, window_start_time + (p_window_minutes || ' minutes')::INTERVAL)
    ON CONFLICT (identifier, action_type, window_start)
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN true;
  ELSE
    -- Mark as blocked and log security event
    UPDATE public.rate_limits 
    SET is_blocked = true 
    WHERE identifier = p_identifier 
      AND action_type = p_action_type
      AND window_start = window_start_time;
    
    INSERT INTO public.security_events (
      event_type, 
      severity, 
      description, 
      ip_address,
      metadata
    ) VALUES (
      'rate_limit',
      'medium',
      'Rate limit exceeded',
      p_identifier,
      jsonb_build_object(
        'action_type', p_action_type,
        'current_count', current_count,
        'max_requests', p_max_requests
      )
    );
    
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;