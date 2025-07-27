
-- Create enhanced matching tables for AI-powered career intelligence

-- Skills taxonomy and market data
CREATE TABLE public.skills_taxonomy (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  aliases text[],
  market_demand_score numeric(3,2) DEFAULT 0,
  growth_rate numeric(5,2) DEFAULT 0,
  avg_salary_usd integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enhanced opportunity matching
CREATE TABLE public.opportunity_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  opportunity_id text NOT NULL,
  match_score numeric(3,2) NOT NULL,
  skill_compatibility jsonb NOT NULL DEFAULT '{}',
  experience_fit numeric(3,2) NOT NULL DEFAULT 0,
  cultural_fit numeric(3,2) NOT NULL DEFAULT 0,
  compensation_alignment numeric(3,2) NOT NULL DEFAULT 0,
  success_prediction numeric(3,2) NOT NULL DEFAULT 0,
  reasoning jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User behavioral profiles for better matching
CREATE TABLE public.user_behavior_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  work_style_preferences jsonb NOT NULL DEFAULT '{}',
  collaboration_preferences jsonb NOT NULL DEFAULT '{}',
  learning_preferences jsonb NOT NULL DEFAULT '{}',
  career_goals jsonb NOT NULL DEFAULT '{}',
  risk_tolerance numeric(3,2) DEFAULT 0.5,
  flexibility_score numeric(3,2) DEFAULT 0.5,
  communication_style text,
  preferred_project_duration text[],
  industry_preferences text[],
  location_preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Market intelligence data
CREATE TABLE public.market_intelligence (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id uuid REFERENCES public.skills_taxonomy(id),
  region text NOT NULL,
  demand_score numeric(3,2) NOT NULL,
  supply_score numeric(3,2) NOT NULL,
  avg_rate_usd integer,
  trend_direction text CHECK (trend_direction IN ('rising', 'stable', 'declining')),
  forecast_data jsonb NOT NULL DEFAULT '{}',
  data_source text NOT NULL,
  collected_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Skills verification records
CREATE TABLE public.skill_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  skill_id uuid REFERENCES public.skills_taxonomy(id),
  verification_type text NOT NULL CHECK (verification_type IN ('peer_review', 'assessment', 'portfolio', 'credential', 'project_demo')),
  verification_source text,
  verification_data jsonb NOT NULL DEFAULT '{}',
  verification_score numeric(3,2) NOT NULL,
  verifier_id uuid,
  blockchain_hash text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enhanced user skills with proficiency tracking
CREATE TABLE public.user_skills_enhanced (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  skill_id uuid REFERENCES public.skills_taxonomy(id),
  proficiency_level integer CHECK (proficiency_level BETWEEN 1 AND 10),
  years_experience numeric(4,2) DEFAULT 0,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
  endorsement_count integer DEFAULT 0,
  last_used_date timestamp with time zone,
  acquired_date timestamp with time zone,
  learning_path_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_opportunity_matches_user_id ON public.opportunity_matches(user_id);
CREATE INDEX idx_opportunity_matches_score ON public.opportunity_matches(match_score DESC);
CREATE INDEX idx_skills_taxonomy_category ON public.skills_taxonomy(category);
CREATE INDEX idx_market_intelligence_skill_region ON public.market_intelligence(skill_id, region);
CREATE INDEX idx_skill_verifications_user_skill ON public.skill_verifications(user_id, skill_id);
CREATE INDEX idx_user_skills_enhanced_user ON public.user_skills_enhanced(user_id);

-- Enable RLS
ALTER TABLE public.skills_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills_enhanced ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Skills taxonomy is viewable by everyone" 
  ON public.skills_taxonomy FOR SELECT USING (true);

CREATE POLICY "Users can view their own opportunity matches" 
  ON public.opportunity_matches FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert opportunity matches" 
  ON public.opportunity_matches FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their behavior profiles" 
  ON public.user_behavior_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Market intelligence is viewable by everyone" 
  ON public.market_intelligence FOR SELECT USING (true);

CREATE POLICY "Users can view their skill verifications" 
  ON public.skill_verifications FOR SELECT USING (auth.uid() = user_id OR auth.uid() = verifier_id);

CREATE POLICY "Users can create skill verifications" 
  ON public.skill_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their enhanced skills" 
  ON public.user_skills_enhanced FOR ALL USING (auth.uid() = user_id);

-- Insert initial skills taxonomy data
INSERT INTO public.skills_taxonomy (name, category, market_demand_score, growth_rate, avg_salary_usd) VALUES
('React', 'Frontend Development', 0.92, 15.5, 95000),
('TypeScript', 'Programming Languages', 0.88, 22.3, 105000),
('Node.js', 'Backend Development', 0.85, 18.7, 98000),
('Python', 'Programming Languages', 0.95, 25.1, 110000),
('Machine Learning', 'Data Science', 0.91, 35.2, 130000),
('Cloud Architecture', 'Infrastructure', 0.89, 28.9, 125000),
('Renewable Energy Systems', 'Green Technology', 0.78, 45.6, 85000),
('Sustainable Development', 'Green Skills', 0.72, 38.4, 75000),
('Carbon Footprint Analysis', 'Environmental', 0.69, 42.1, 70000),
('Blockchain Development', 'Emerging Tech', 0.76, 31.8, 115000);
