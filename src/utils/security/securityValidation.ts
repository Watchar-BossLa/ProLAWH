
import { ValidationRule } from './types';

class SecurityValidation {
  validateInput(data: Record<string, any>, rules: ValidationRule[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${rule.field} must be a valid email`);
        }

        if (rule.maxLength && String(value).length > rule.maxLength) {
          errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`);
        }

        if (rule.pattern && !rule.pattern.test(String(value))) {
          errors.push(`${rule.field} format is invalid`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

export const securityValidation = new SecurityValidation();
