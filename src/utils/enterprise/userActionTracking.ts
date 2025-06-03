
import { PerformanceTracker } from '../logging';

export class UserActionTracking {
  static setupUserActionTracking(): void {
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
}
