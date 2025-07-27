
import { DEVELOPMENT_CONFIG } from './development';
import { PRODUCTION_CONFIG } from './production';

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Export the appropriate config
export const CONFIG = isProduction ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

// Environment detection utilities
export const ENV = {
  isProduction,
  isDevelopment,
  isTest: process.env.NODE_ENV === 'test'
};

// Helper to get config value with fallback
export function getConfig<T>(path: string, fallback?: T): T {
  const keys = path.split('.');
  let value: any = CONFIG;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback as T;
    }
  }
  
  return value as T;
}
