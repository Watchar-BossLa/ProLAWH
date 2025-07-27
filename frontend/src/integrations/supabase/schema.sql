
-- Career recommendations table for AI Career Twin feature
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('skill_gap', 'job_match', 'mentor_suggest')),
  recommendation TEXT NOT NULL,
  relevance_score DECIMAL(5,4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;

-- Policy so users can only see their own recommendations
CREATE POLICY "Users can view their own career recommendations"
ON public.career_recommendations
FOR SELECT
USING (auth.uid() = user_id);

-- Policy so users can update their own recommendations
CREATE POLICY "Users can update their own career recommendations"
ON public.career_recommendations
FOR UPDATE
USING (auth.uid() = user_id);

