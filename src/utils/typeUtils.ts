
import { Json } from '@/integrations/supabase/types';

/**
 * Type guard to check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Safely converts Supabase Json type to application types with proper type checking
 */
export function safeJsonParse<T>(json: Json | null | undefined, fallback: T): T {
  if (json === null || json === undefined) {
    return fallback;
  }
  
  return json as unknown as T;
}

/**
 * Safely converts application types to Supabase Json type
 */
export function safeJsonStringify<T>(value: T): Json {
  return value as unknown as Json;
}

/**
 * Provides default values for potentially missing properties
 */
export function withDefaults<T, K extends keyof T>(obj: Partial<T>, defaults: Pick<T, K>): T & Pick<T, K> {
  return { ...defaults, ...obj } as T & Pick<T, K>;
}
