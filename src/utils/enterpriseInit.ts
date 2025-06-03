import { enterpriseLogger, PerformanceTracker } from './logging';
import { enterpriseSecurity } from './security';
import { enterpriseHealthMonitor } from './health';

class EnterpriseSystem {
  private static instance: EnterpriseSystem;
  private initialized = false;

  static getInstance(): EnterpriseSystem {
    if (!EnterpriseSystem.instance) {
      EnterpriseSystem.instance = new EnterpriseSystem();
    }
    return EnterpriseSystem.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      enterpriseLogger.warn('Enterprise system already initialized', {}, 'EnterpriseSystem');
      return;
    }

    try {
      const initTimer = PerformanceTracker.trackPageLoad('enterprise_initialization');

      // Initialize security monitoring
      enterpriseSecurity.initialize();
      enterpriseLogger.info('Enterprise security initialized', {}, 'EnterpriseSystem');

      // Start health monitoring (every 5 minutes)
      enterpriseHealthMonitor.startMonitoring(300000);
      enterpriseLogger.info('Enterprise health monitoring started', {}, 'EnterpriseSystem');

      // Set up global error handlers
      this.setupGlobalErrorHandlers();
      enterpriseLogger.info('Global error handlers configured', {}, 'EnterpriseSystem');

      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      enterpriseLogger.info('Performance monitoring configured', {}, 'EnterpriseSystem');

      // Set up automatic logging for user actions
      this.setupUserActionTracking();
      enterpriseLogger.info('User action tracking configured', {}, 'EnterpriseSystem');

      this.initialized = true;
      initTimer.end();
      
      enterpriseLogger.info('Enterprise system fully initialized', {
        initializationComplete: true,
        timestamp: new Date().toISOString()
      }, 'EnterpriseSystem');

    } catch (error) {
      enterpriseLogger.critical('Failed to initialize enterprise system', error as Error, {}, 'EnterpriseSystem');
      throw error;
    }
  }

  private setupGlobalErrorHandlers(): void {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      enterpriseLogger.error('Unhandled promise rejection', new Error(event.reason), {
        reason: event.reason,
        promise: event.promise.toString()
      }, 'GlobalErrorHandler');
    });

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      enterpriseLogger.error('Global JavaScript error', new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }, 'GlobalErrorHandler');
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        enterpriseLogger.error('Resource loading error', undefined, {
          tagName: (event.target as Element)?.tagName,
          source: (event.target as any)?.src || (event.target as any)?.href,
          type: event.type
        }, 'ResourceErrorHandler');
      }
    }, true);
  }

  private setupPerformanceMonitoring(): void {
    // Monitor navigation timing
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Track key performance metrics
          enterpriseLogger.metric({
            name: 'page_load_time',
            value: navEntry.loadEventEnd - navEntry.loadEventStart,
            unit: 'ms',
            tags: { type: 'navigation' }
          });

          enterpriseLogger.metric({
            name: 'dom_content_loaded',
            value: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            unit: 'ms',
            tags: { type: 'navigation' }
          });

          enterpriseLogger.metric({
            name: 'first_byte',
            value: navEntry.responseStart - navEntry.requestStart,
            unit: 'ms',
            tags: { type: 'navigation' }
          });
        }
      });
    });

    observer.observe({ type: 'navigation', buffered: true });

    // Monitor paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        enterpriseLogger.metric({
          name: entry.name.replace('-', '_'),
          value: entry.startTime,
          unit: 'ms',
          tags: { type: 'paint' }
        });
      });
    });

    paintObserver.observe({ type: 'paint', buffered: true });
  }

  private setupUserActionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
        PerformanceTracker.trackUserAction('button_click', undefined, {
          buttonText: target.textContent?.substring(0, 50) || 'unknown',
          className: target.className,
          id: target.id
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      PerformanceTracker.trackUserAction('form_submit', undefined, {
        formId: form.id,
        formAction: form.action,
        method: form.method
      });
    });

    // Track navigation
    let currentPath = window.location.pathname;
    const trackNavigation = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        PerformanceTracker.trackUserAction('navigation', undefined, {
          from: currentPath,
          to: newPath
        });
        currentPath = newPath;
      }
    };

    window.addEventListener('popstate', trackNavigation);
    
    // Override pushState and replaceState to track programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      trackNavigation();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      trackNavigation();
    };
  }

  getSystemStatus(): {
    initialized: boolean;
    timestamp: string;
    uptime: number;
  } {
    return {
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      uptime: performance.now()
    };
  }

  async shutdown(): Promise<void> {
    if (!this.initialized) return;

    enterpriseLogger.info('Shutting down enterprise system', {}, 'EnterpriseSystem');
    
    enterpriseHealthMonitor.stopMonitoring();
    enterpriseLogger.destroy();
    
    this.initialized = false;
    
    console.log('Enterprise system shutdown complete');
  }
}

// Export singleton instance
export const enterpriseSystem = EnterpriseSystem.getInstance();

// Auto-initialize in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || localStorage.getItem('prolawh_enterprise_mode') === 'true') {
  enterpriseSystem.initialize().catch(error => {
    console.error('Failed to auto-initialize enterprise system:', error);
  });
}
