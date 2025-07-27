import { DSPyBaseModule } from './DSPyBaseModule';
import { CareerAdviceSignature } from '../types';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';

/**
 * DSPy-powered Career Advice Module
 * Provides optimized career guidance using DSPy framework
 */
export class CareerAdviceModule extends DSPyBaseModule {
  constructor(llmAdapter: DSPyLLMAdapter) {
    const signature: CareerAdviceSignature = {
      input_fields: {
        user_profile: "User's professional background, experience, and current situation",
        career_goals: "User's career aspirations and objectives",
        current_skills: "User's existing skills and competencies",
        context: "Additional context, challenges, or specific circumstances"
      },
      output_fields: {
        advice: "Personalized career advice and guidance",
        action_items: "Specific, actionable steps the user should take",
        resources: "Relevant resources, tools, or learning materials",
        confidence: "Confidence level in the advice provided (0-1)"
      },
      instruction: `You are an expert career advisor with deep knowledge of various industries, career paths, and professional development strategies.

Analyze the user's profile, goals, and current situation to provide personalized, actionable career advice. Your advice should be:

1. **Personalized**: Tailored to the user's specific situation, background, and goals
2. **Actionable**: Include specific steps the user can take immediately
3. **Strategic**: Consider both short-term actions and long-term career planning
4. **Evidence-based**: Draw from industry knowledge and career development best practices
5. **Realistic**: Acknowledge constraints while being optimistic about possibilities

Focus on practical guidance that will help the user make meaningful progress toward their career goals.`
    };

    super('CareerAdviceModule', signature, llmAdapter, {
      temperature: 0.7,
      max_tokens: 1024,
    });
  }

  /**
   * Generate career advice with enhanced context processing
   */
  async generateAdvice(
    userProfile: any,
    careerGoals: string,
    currentSkills: string[],
    additionalContext?: any
  ): Promise<{
    advice: string;
    actionItems: string[];
    resources: string[];
    confidence: number;
    metadata: any;
  }> {
    const inputs = {
      user_profile: JSON.stringify(userProfile),
      career_goals: careerGoals,
      current_skills: currentSkills.join(', '),
      context: additionalContext ? JSON.stringify(additionalContext) : 'No additional context provided'
    };

    const result = await this.forward(inputs);

    return {
      advice: result.advice,
      actionItems: this.parseActionItems(result.action_items),
      resources: this.parseResources(result.resources),
      confidence: parseFloat(result.confidence) || 0.8,
      metadata: {
        analysis_depth: this.assessAnalysisDepth(result.advice),
        personalization_score: this.calculatePersonalizationScore(inputs, result),
        industry_relevance: this.assessIndustryRelevance(userProfile, result.advice)
      }
    };
  }

  /**
   * Parse action items from string format
   */
  private parseActionItems(actionItemsStr: string): string[] {
    return actionItemsStr
      .split('\n')
      .map(item => item.replace(/^[-•*]\s*/, '').trim())
      .filter(item => item.length > 0);
  }

  /**
   * Parse resources from string format
   */
  private parseResources(resourcesStr: string): string[] {
    return resourcesStr
      .split('\n')
      .map(resource => resource.replace(/^[-•*]\s*/, '').trim())
      .filter(resource => resource.length > 0);
  }

  /**
   * Assess the depth of analysis in the advice
   */
  private assessAnalysisDepth(advice: string): 'surface' | 'moderate' | 'deep' {
    const wordCount = advice.split(' ').length;
    const mentionsStrategicTerms = /strategy|plan|long.term|career path|professional development/i.test(advice);
    
    if (wordCount > 200 && mentionsStrategicTerms) return 'deep';
    if (wordCount > 100) return 'moderate';
    return 'surface';
  }

  /**
   * Calculate personalization score based on input utilization
   */
  private calculatePersonalizationScore(inputs: Record<string, any>, result: Record<string, any>): number {
    let score = 0;
    
    // Check if advice references user profile elements
    if (result.advice.toLowerCase().includes('your experience') || 
        result.advice.toLowerCase().includes('your background')) {
      score += 0.3;
    }
    
    // Check if advice references specific skills
    const skills = inputs.current_skills.toLowerCase();
    const adviceLower = result.advice.toLowerCase();
    if (skills.split(',').some(skill => adviceLower.includes(skill.trim()))) {
      score += 0.3;
    }
    
    // Check if advice references career goals
    if (result.advice.toLowerCase().includes('goal') || 
        result.advice.toLowerCase().includes('objective')) {
      score += 0.2;
    }
    
    // Check if context is utilized
    if (inputs.context !== 'No additional context provided' && 
        result.advice.length > 150) {
      score += 0.2;
    }
    
    return Math.min(1, score);
  }

  /**
   * Assess industry relevance of the advice
   */
  private assessIndustryRelevance(userProfile: any, advice: string): 'low' | 'medium' | 'high' {
    try {
      const profile = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile;
      const industry = profile.industry || profile.field || '';
      
      if (industry && advice.toLowerCase().includes(industry.toLowerCase())) {
        return 'high';
      }
      
      // Check for industry-related keywords
      const hasIndustryKeywords = /industry|sector|field|domain|market|professional/i.test(advice);
      return hasIndustryKeywords ? 'medium' : 'low';
    } catch {
      return 'medium';
    }
  }

  /**
   * Generate training examples for optimization
   */
  generateTrainingExamples(): void {
    const examples = [
      {
        inputs: {
          user_profile: JSON.stringify({
            title: "Software Engineer",
            experience: "3 years",
            industry: "Technology",
            company_size: "Startup"
          }),
          career_goals: "Become a tech lead within 2 years",
          current_skills: "JavaScript, React, Node.js, Python",
          context: "Currently working remotely, interested in growing leadership skills"
        },
        outputs: {
          advice: "Focus on developing both technical depth and leadership skills simultaneously. Your 3 years of experience positions you well for a tech lead role, but you'll need to demonstrate both advanced technical capabilities and the ability to guide other developers.",
          action_items: "1. Take on mentoring responsibilities for junior developers\n2. Lead a small project or feature development\n3. Improve system design skills through online courses\n4. Practice technical communication and documentation",
          resources: "1. 'The Manager's Path' by Camille Fournier\n2. System Design Interview courses\n3. Internal mentoring programs\n4. Technical leadership workshops",
          confidence: "0.85"
        }
      },
      {
        inputs: {
          user_profile: JSON.stringify({
            title: "Marketing Coordinator",
            experience: "1 year",
            industry: "E-commerce",
            education: "Marketing degree"
          }),
          career_goals: "Transition to product marketing specialist role",
          current_skills: "Content creation, social media, email marketing, analytics",
          context: "Want to work more closely with product teams and understand customer needs better"
        },
        outputs: {
          advice: "Your foundation in marketing gives you an advantage for product marketing. Focus on developing product-specific skills and understanding of customer research methodologies. Your analytical skills will be valuable in this transition.",
          action_items: "1. Learn product management fundamentals\n2. Conduct customer interviews and user research\n3. Collaborate with product teams on current projects\n4. Develop competitive analysis skills",
          resources: "1. Product Marketing Alliance courses\n2. 'Crossing the Chasm' by Geoffrey Moore\n3. Customer research tools (Hotjar, UserVoice)\n4. Product management certification programs",
          confidence: "0.80"
        }
      }
    ];

    this.addExamples(examples);
  }
}