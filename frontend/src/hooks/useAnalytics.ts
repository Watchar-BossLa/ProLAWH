
import { useState, useEffect } from 'react';

interface AnalyticsData {
  learningVelocity: number;
  skillsCompleted: number;
  hoursStudied: number;
  streakDays: number;
  performanceScore: number;
}

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalyticsData({
          learningVelocity: 8.5,
          skillsCompleted: 12,
          hoursStudied: 156,
          streakDays: 23,
          performanceScore: 85
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    analyticsData,
    isLoading
  };
}
