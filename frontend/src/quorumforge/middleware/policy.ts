
import { Plan } from '../core/CouncilBase';

export interface PolicyDecision {
  allow: boolean;
  reasons?: string[];
}

// Simple in-memory policy engine
// In a production setup, this would call an OPA server
export class PolicyEngine {
  private policies: Record<string, (plan: Plan) => PolicyDecision> = {};
  
  constructor() {
    // Register default policies
    this.registerPolicy('max_risk_score', (plan: Plan) => {
      const maxRiskScore = 0.3;
      if ((plan.risk_score || 0) > maxRiskScore) {
        return {
          allow: false,
          reasons: [`Risk score ${plan.risk_score} exceeds maximum allowed ${maxRiskScore}`]
        };
      }
      return { allow: true };
    });
    
    this.registerPolicy('require_chaos_success', (plan: Plan) => {
      // Only enforce for production environments
      const isProd = process.env.NODE_ENV === 'production';
      
      if (isProd && plan.chaos_result === 'failure') {
        return {
          allow: false,
          reasons: ['Chaos test failed, cannot proceed with plan']
        };
      }
      return { allow: true };
    });
  }
  
  registerPolicy(name: string, policyFn: (plan: Plan) => PolicyDecision) {
    this.policies[name] = policyFn;
  }
  
  evaluate(plan: Plan): PolicyDecision {
    const denials: string[] = [];
    
    // Evaluate all policies
    for (const [name, policyFn] of Object.entries(this.policies)) {
      const decision = policyFn(plan);
      if (!decision.allow) {
        console.log(`Policy ${name} denied plan: ${decision.reasons?.join(', ')}`);
        denials.push(...(decision.reasons || []));
      }
    }
    
    return {
      allow: denials.length === 0,
      reasons: denials.length > 0 ? denials : undefined
    };
  }
}

// Export singleton instance
export const policyEngine = new PolicyEngine();
