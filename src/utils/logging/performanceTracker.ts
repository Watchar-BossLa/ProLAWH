
import { enterpriseLogger } from './enterpriseLogger';

export class PerformanceTracker {
  static trackAPICall<T>(
    apiName: string, 
    apiCall: () => Promise<T>,
    userId?: string
  ): Promise<T> {
    const timer = enterpriseLogger.startTimer(`api_${apiName}`, userId, { type: 'api_call' });
    
    return apiCall()
      .then(result => {
        timer.end();
        enterpriseLogger.info(`API call ${apiName} completed successfully`, { apiName }, 'PerformanceTracker');
        return result;
      })
      .catch(error => {
        timer.end();
        enterpriseLogger.error(`API call ${apiName} failed`, error, { apiName }, 'PerformanceTracker');
        throw error;
      });
  }

  static trackPageLoad(pageName: string, userId?: string) {
    const timer = enterpriseLogger.startTimer(`page_load_${pageName}`, userId, { type: 'page_load' });
    
    return {
      end: () => {
        const duration = timer.end();
        enterpriseLogger.info(`Page ${pageName} loaded`, { pageName, loadTime: duration }, 'PerformanceTracker');
        return duration;
      }
    };
  }

  static trackUserAction(actionName: string, userId?: string, metadata?: Record<string, any>) {
    enterpriseLogger.metric({ 
      name: `user_action_${actionName}`, 
      value: 1, 
      unit: 'count', 
      userId, 
      tags: { type: 'user_action', action: actionName } 
    });
    
    enterpriseLogger.info(`User action: ${actionName}`, metadata, 'PerformanceTracker');
  }
}
