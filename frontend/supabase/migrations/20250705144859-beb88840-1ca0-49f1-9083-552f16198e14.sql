
-- Create table for WebRTC call signaling
CREATE TABLE public.call_signals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate')),
  signal_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calling', 'ringing', 'connected', 'ended')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone DEFAULT (now() + interval '5 minutes') NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_call_signals_recipient ON public.call_signals(recipient_id);
CREATE INDEX idx_call_signals_caller ON public.call_signals(caller_id);
CREATE INDEX idx_call_signals_status ON public.call_signals(status);
CREATE INDEX idx_call_signals_expires ON public.call_signals(expires_at);

-- Enable RLS
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert their own call signals" 
  ON public.call_signals 
  FOR INSERT 
  WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can view call signals they are part of" 
  ON public.call_signals 
  FOR SELECT 
  USING (auth.uid() = caller_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can update call signals they are part of" 
  ON public.call_signals 
  FOR UPDATE 
  USING (auth.uid() = caller_id OR auth.uid() = recipient_id);

-- Create function to clean up expired call signals
CREATE OR REPLACE FUNCTION public.cleanup_expired_call_signals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.call_signals 
  WHERE expires_at < now();
END;
$$;

-- Enable realtime for call signaling
ALTER TABLE public.call_signals REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.call_signals;
