
import { Plan, PlanVote } from './CouncilBase';
import { policyEngine } from '../middleware/policy';
import { throttle } from '../middleware/limits';

export class SeniorManagerGPT {
  private static instance: SeniorManagerGPT;
  private budget: number = 100; // Daily budget in abstract "units"
  
  private constructor() {
    // Initialize budget reset mechanism
    this.scheduleBudgetReset();
  }
  
  // Singleton pattern
  static getInstance(): SeniorManagerGPT {
    if (!SeniorManagerGPT.instance) {
      SeniorManagerGPT.instance = new SeniorManagerGPT();
    }
    return SeniorManagerGPT.instance;
  }
  
  private scheduleBudgetReset() {
    // Reset budget daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.budget = 100; // Reset budget
      console.log('Budget reset to 100 units');
      this.scheduleBudgetReset(); // Schedule next reset
    }, msUntilMidnight);
  }
  
  async evaluatePlan(plan: Plan, votes: PlanVote[]): Promise<boolean> {
    await throttle('senior_manager', 5); // Higher cost for senior manager
    
    // Check budget constraints
    if (this.budget <= 0) {
      console.log('Daily budget exhausted, rejecting plan');
      return false;
    }
    
    // Calculate approval rate
    const approvalCount = votes.filter(v => v.approved).length;
    const approvalRate = approvalCount / votes.length;
    
    if (approvalRate < 0.8) {
      console.log(`Plan rejected: Approval rate ${approvalRate} below threshold 0.8`);
      return false;
    }
    
    // Check policy compliance
    const policyDecision = policyEngine.evaluate(plan);
    if (!policyDecision.allow) {
      console.log('Plan rejected by policy engine');
      return false;
    }
    
    // Approve plan and deduct from budget
    this.budget -= 5; // Cost per approved plan
    console.log(`Plan approved, remaining budget: ${this.budget}`);
    return true;
  }
  
  async delegateToCouncil(task: string, context: Record<string, any>): Promise<string> {
    // Simple task routing logic for council selection
    const councilTypes = ['scan', 'fix', 'security', 'red-team'];
    
    // Very basic keyword matching for council selection
    let selectedCouncil = councilTypes[0]; // Default to scan council
    
    if (task.toLowerCase().includes('fix') || task.toLowerCase().includes('change')) {
      selectedCouncil = councilTypes[1];
    } else if (task.toLowerCase().includes('secur') || task.toLowerCase().includes('hack')) {
      selectedCouncil = councilTypes[2];
    } else if (task.toLowerCase().includes('attack') || task.toLowerCase().includes('test')) {
      selectedCouncil = councilTypes[3];
    }
    
    console.log(`Task delegated to ${selectedCouncil} council`);
    return selectedCouncil;
  }
}
