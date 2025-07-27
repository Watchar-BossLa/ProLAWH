
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export class StudyBeeDataValidator {
  static validateSession(data: any): ValidationResult {
    const errors: string[] = [];
    
    if (!data) {
      return { isValid: false, errors: ['Session data is required'] };
    }

    // Required fields
    if (!data.session_id || typeof data.session_id !== 'string') {
      errors.push('Valid session_id is required');
    }
    
    if (!data.user_id || typeof data.user_id !== 'string') {
      errors.push('Valid user_id is required');
    }

    if (!data.subject || typeof data.subject !== 'string') {
      errors.push('Subject is required');
    }

    if (typeof data.duration_minutes !== 'number' || data.duration_minutes < 0) {
      errors.push('Duration must be a positive number');
    }

    // Validate session type
    const validSessionTypes = ['study', 'quiz', 'review', 'practice'];
    if (!validSessionTypes.includes(data.session_type)) {
      errors.push('Invalid session type');
    }

    // Validate progress percentage
    if (typeof data.progress_percentage !== 'number' || 
        data.progress_percentage < 0 || 
        data.progress_percentage > 100) {
      errors.push('Progress percentage must be between 0 and 100');
    }

    // Validate quiz score if present
    if (data.quiz_score !== undefined && 
        (typeof data.quiz_score !== 'number' || 
         data.quiz_score < 0 || 
         data.quiz_score > 100)) {
      errors.push('Quiz score must be between 0 and 100');
    }

    // Validate dates
    if (data.started_at && !this.isValidDate(data.started_at)) {
      errors.push('Invalid started_at date');
    }

    if (data.completed_at && !this.isValidDate(data.completed_at)) {
      errors.push('Invalid completed_at date');
    }

    const sanitizedData = errors.length === 0 ? {
      session_id: this.sanitizeString(data.session_id),
      user_id: data.user_id,
      session_type: this.sanitizeString(data.session_type),
      subject: this.sanitizeString(data.subject),
      duration_minutes: Math.max(0, Math.floor(data.duration_minutes)),
      progress_percentage: Math.max(0, Math.min(100, data.progress_percentage)),
      notes_count: Math.max(0, Math.floor(data.notes_count || 0)),
      quiz_score: data.quiz_score ? Math.max(0, Math.min(100, data.quiz_score)) : undefined,
      started_at: data.started_at,
      completed_at: data.completed_at,
      metadata: this.sanitizeMetadata(data.metadata)
    } : undefined;

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  static validateProgress(data: any): ValidationResult {
    const errors: string[] = [];
    
    if (!data) {
      return { isValid: false, errors: ['Progress data is required'] };
    }

    // Validate numeric fields
    if (typeof data.total_study_time !== 'number' || data.total_study_time < 0) {
      errors.push('Total study time must be a positive number');
    }

    if (typeof data.sessions_this_week !== 'number' || data.sessions_this_week < 0) {
      errors.push('Sessions this week must be a positive number');
    }

    if (typeof data.current_streak !== 'number' || data.current_streak < 0) {
      errors.push('Current streak must be a positive number');
    }

    if (typeof data.longest_streak !== 'number' || data.longest_streak < 0) {
      errors.push('Longest streak must be a positive number');
    }

    // Validate arrays
    if (!Array.isArray(data.subjects_studied)) {
      errors.push('Subjects studied must be an array');
    }

    if (!Array.isArray(data.achievements)) {
      errors.push('Achievements must be an array');
    }

    // Validate performance metrics
    if (!data.performance_metrics || typeof data.performance_metrics !== 'object') {
      errors.push('Performance metrics are required');
    } else {
      const metrics = data.performance_metrics;
      if (typeof metrics.focus_score !== 'number' || metrics.focus_score < 0 || metrics.focus_score > 100) {
        errors.push('Focus score must be between 0 and 100');
      }
      if (typeof metrics.retention_rate !== 'number' || metrics.retention_rate < 0 || metrics.retention_rate > 100) {
        errors.push('Retention rate must be between 0 and 100');
      }
      if (typeof metrics.quiz_average !== 'number' || metrics.quiz_average < 0 || metrics.quiz_average > 100) {
        errors.push('Quiz average must be between 0 and 100');
      }
    }

    const sanitizedData = errors.length === 0 ? {
      total_study_time: Math.max(0, data.total_study_time),
      sessions_this_week: Math.max(0, Math.floor(data.sessions_this_week)),
      current_streak: Math.max(0, Math.floor(data.current_streak)),
      longest_streak: Math.max(0, Math.floor(data.longest_streak)),
      subjects_studied: (data.subjects_studied || []).map((s: any) => this.sanitizeString(s)),
      achievements: (data.achievements || []).map((a: any) => this.sanitizeString(a)),
      performance_metrics: {
        focus_score: Math.max(0, Math.min(100, data.performance_metrics.focus_score)),
        retention_rate: Math.max(0, Math.min(100, data.performance_metrics.retention_rate)),
        quiz_average: Math.max(0, Math.min(100, data.performance_metrics.quiz_average))
      }
    } : undefined;

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getTime() > 0;
  }

  private static sanitizeString(str: any): string {
    if (typeof str !== 'string') return '';
    return str.trim().substring(0, 1000); // Limit length
  }

  private static sanitizeMetadata(metadata: any): Record<string, any> {
    if (!metadata || typeof metadata !== 'object') return {};
    
    const sanitized: Record<string, any> = {};
    Object.keys(metadata).forEach(key => {
      if (typeof key === 'string' && key.length <= 100) {
        const value = metadata[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        }
      }
    });
    
    return sanitized;
  }
}
