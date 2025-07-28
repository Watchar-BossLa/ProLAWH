export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  operation?: string;
  component?: string;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface ErrorLogEntry {
  id: string;
  message: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  stack?: string;
  timestamp: string;
}