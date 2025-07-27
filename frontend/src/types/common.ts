/**
 * Common Type Definitions
 * Shared types across the application
 */

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: Date;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter Types
export interface FilterOption {
  key: string;
  label: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  options?: { label: string; value: any }[];
}

export interface FilterState {
  [key: string]: any;
}

// Status Types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Visibility = 'public' | 'private' | 'restricted';

// File Types
export interface FileUpload {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Location Types
export interface Location {
  country: string;
  state?: string;
  city: string;
  timezone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: string;
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Search Types
export interface SearchParams {
  query: string;
  filters?: FilterState;
  pagination?: PaginationParams;
  facets?: string[];
}

export interface SearchResult<T> {
  items: T[];
  facets: Record<string, { value: any; count: number }[]>;
  totalCount: number;
  searchTime: number;
  suggestions?: string[];
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Generic Types
export type ID = string;

export type Timestamp = Date | string;

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;