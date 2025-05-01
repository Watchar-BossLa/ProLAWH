
/**
 * Makes all properties in type T optional recursively
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Makes specific keys K of type T required
 */
export type RequiredKeys<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

/**
 * Validates exact object shape (no extra properties allowed)
 */
export type Exact<T, Shape> = T extends Shape ? 
  Exclude<keyof T, keyof Shape> extends never ? T : never 
  : never;

/**
 * Result type for async operations
 */
export type AsyncResult<T> = Promise<{
  data: T;
  error: null;
} | {
  data: null;
  error: {
    message: string;
    code?: string;
  };
}>;

/**
 * Ensures non-nullable array items
 */
export type NonNullableArray<T> = Array<NonNullable<T>>;

/**
 * Type for environment variables
 */
export interface ENV {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PROJECT_ID: string;
  VITE_SUPABASE_ANON_KEY: string;
}
