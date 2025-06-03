
import { enterpriseLogger } from '../logging';

export class PerformanceMonitoring {
  static setupPerformanceMonitoring(): void {
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
}
