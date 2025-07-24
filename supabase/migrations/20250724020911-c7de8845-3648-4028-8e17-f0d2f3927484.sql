-- Create DSPy optimization and training data tables
CREATE TABLE public.dspy_optimization_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  optimization_run_id UUID NOT NULL DEFAULT gen_random_uuid(),
  prompt_variations JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_prompt TEXT NOT NULL,
  performance_score NUMERIC NOT NULL,
  optimization_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  training_examples_count INTEGER NOT NULL DEFAULT 0,
  optimization_duration_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.dspy_training_examples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  inputs JSONB NOT NULL,
  expected_outputs JSONB NOT NULL,
  actual_outputs JSONB,
  quality_score NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.dspy_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  measurement_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.dspy_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dspy_training_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dspy_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Authenticated users can view DSPy optimization history" 
ON public.dspy_optimization_history 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert DSPy optimization history" 
ON public.dspy_optimization_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view DSPy training examples" 
ON public.dspy_training_examples 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can manage DSPy training examples" 
ON public.dspy_training_examples 
FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can view DSPy performance metrics" 
ON public.dspy_performance_metrics 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert DSPy performance metrics" 
ON public.dspy_performance_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_dspy_optimization_module_name ON public.dspy_optimization_history(module_name);
CREATE INDEX idx_dspy_optimization_created_at ON public.dspy_optimization_history(created_at DESC);
CREATE INDEX idx_dspy_training_module_name ON public.dspy_training_examples(module_name);
CREATE INDEX idx_dspy_performance_module_metric ON public.dspy_performance_metrics(module_name, metric_name);
CREATE INDEX idx_dspy_performance_timestamp ON public.dspy_performance_metrics(measurement_timestamp DESC);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_dspy_optimization_updated_at
  BEFORE UPDATE ON public.dspy_optimization_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dspy_training_updated_at
  BEFORE UPDATE ON public.dspy_training_examples
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();