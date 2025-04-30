
import { GreenProject, ProjectApplication } from '@/types/projects';
import { Json } from '@/integrations/supabase/types';

// Database record types
export interface ProjectRecord {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  skills_needed?: string[] | null;
  team_size?: number | null;
  duration?: string | null;
  impact_area?: string | null;
  location?: string | null;
  deadline?: string | null;
  carbon_reduction?: number | null;
  sdg_alignment?: string[] | null;
  compensation?: string | null;
  has_insurance?: boolean | null;
  insurance_details?: Record<string, string> | null;
  created_by?: string | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  project_id: string;
  status: string;
  message?: string | null;
  // Make applied_at optional since it might not be in the database response
  applied_at?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

export interface ApplicationResponseRecord {
  id: string;
  user_id: string;
  project_id: string;
  status: string;
  message?: string | null;
  created_at: string;
  updated_at: string;
  // Make applied_at optional for database responses
  applied_at?: string | null;
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

// Type guard for application records
export function isApplicationRecord(value: unknown): value is ApplicationRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.user_id === 'string' &&
    typeof record.project_id === 'string' &&
    typeof record.status === 'string'
  );
}

// Hook state interface
export interface ProjectMarketplaceState {
  searchQuery: string;
  filterCategory: string;
  isSubmitting: boolean;
}

// Filter interface
export interface ProjectFilters {
  category: string;
  searchQuery?: string;
}
