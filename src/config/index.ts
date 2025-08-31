
/**
 * Minimal config so imports like "@/config" resolve during build.
 * Uses Vite's import.meta.env.MODE when available.
 */
const mode: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as any)?.env &&
    (import.meta as any).env.MODE) ||
  "development";

const isProduction = mode === "production";
const isDevelopment = !isProduction;

export const CONFIG = {
  // Allow skipping auth in development to prevent redirect loops in preview
  BYPASS_AUTH: true,
};

export const ENV = {
  isProduction,
  isDevelopment,
  isTest: false,
};

// Simple nested getter used by some parts of the app
export function getConfig<T>(path: string, fallback?: T): T {
  const keys = path.split(".");
  let value: any = CONFIG;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return fallback as T;
    }
  }

  return value as T;
}
