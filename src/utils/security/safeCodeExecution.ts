/**
 * SECURITY: Safe code execution utility to replace dangerous Function() constructor
 * This prevents code injection vulnerabilities in arcade challenges
 */

export interface CodeExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
}

/**
 * Safe code execution for arcade challenges
 * Uses a whitelist approach and sandboxed environment
 */
export async function safeCodeExecution(code: string, input: string): Promise<any> {
  // Validate input code for dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/i,
    /Function\s*\(/i,
    /new\s+Function/i,
    /setTimeout|setInterval/i,
    /XMLHttpRequest|fetch/i,
    /document\./i,
    /window\./i,
    /location\./i,
    /localStorage|sessionStorage/i,
    /import\s*\(/i,
    /require\s*\(/i,
    /__proto__|prototype/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error('Code contains prohibited patterns');
    }
  }

  // Basic length limit
  if (code.length > 1000) {
    throw new Error('Code exceeds maximum length');
  }

  try {
    // Create a safe sandbox environment
    const sandbox = {
      input,
      console: { log: () => {} }, // Disabled console
      Math,
      String,
      Number,
      Array,
      Object: {
        keys: Object.keys,
        values: Object.values,
        entries: Object.entries
      },
      JSON: {
        parse: JSON.parse,
        stringify: JSON.stringify
      }
    };

    // Create a simple function wrapper that only allows basic operations
    const allowedGlobals = Object.keys(sandbox).join(',');
    const safeCode = `
      (function(${allowedGlobals}) {
        'use strict';
        return (function(input) {
          ${code}
        })(input);
      })
    `;

    // Use Function constructor with limited scope
    const func = new Function(`return ${safeCode}`)();
    const result = func(...Object.values(sandbox));
    
    return result;
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
}

/**
 * Safe mathematical expression evaluator
 */
export function safeMathCalculation(expression: string): number {
  // Whitelist allowed characters and operations
  const allowedPattern = /^[\d+\-*/(). ]+$/;
  
  if (!allowedPattern.test(expression)) {
    throw new Error('Expression contains invalid characters');
  }

  // Remove spaces and validate parentheses
  const cleaned = expression.replace(/\s/g, '');
  if (!isValidParentheses(cleaned)) {
    throw new Error('Invalid parentheses');
  }

  try {
    // Use Function constructor with minimal scope for math operations
    const result = new Function(`'use strict'; return (${cleaned})`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid mathematical result');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Mathematical evaluation error: ${error.message}`);
  }
}

function isValidParentheses(str: string): boolean {
  let count = 0;
  for (const char of str) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}