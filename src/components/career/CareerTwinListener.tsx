
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useBiasShield } from '@/hooks/useBiasShield';
import { useCareerTwin } from '@/hooks/useCareerTwin';
import { toast } from '@/hooks/use-toast';

// This component doesn't render anything; it just sets up listeners
export function CareerTwinListener() {
  const { user } = useAuth();
  const { trackActivity } = useActivityTracker();
  const { checkForBias } = useBiasShield();
  const { generateRecommendation } = useCareerTwin();
  
  // Set up activity listeners
  useEffect(() => {
    if (!user) return;
    
    // Create a debounced recommendation generator
    let recommendationTimer: ReturnType<typeof setTimeout>;
    let activityCounter = 0;
    
    const checkAndGenerateRecommendation = async () => {
      try {
        // Check for bias in recommendation generation
        const biasCheckResult = await checkForBias({
          user_id: user.id,
          activity_count: activityCounter,
        });
        
        if (biasCheckResult.passed) {
          await generateRecommendation.mutateAsync();
          
          // Show a notification to the user
          toast({
            title: "New Career Insight Available",
            description: "Your AI Career Twin has generated a new recommendation based on your activity.",
          });
          
          // Reset the activity counter
          activityCounter = 0;
        } else {
          console.log('Recommendation generation failed bias check:', biasCheckResult);
        }
      } catch (error) {
        console.error('Error generating recommendation:', error);
      }
    };
    
    // Set up an event listener for user activity
    // This is a simplified example - in a real implementation we would 
    // listen for specific user interactions across the platform
    const handleUserActivity = () => {
      activityCounter++;
      
      // Clear the existing timer
      if (recommendationTimer) {
        clearTimeout(recommendationTimer);
      }
      
      // Only check for recommendations after a threshold of activity
      if (activityCounter >= 5) {
        // Set a timer to check for recommendations after user has been inactive
        recommendationTimer = setTimeout(() => {
          checkAndGenerateRecommendation();
        }, 60000); // 1 minute of inactivity
      }
    };
    
    // Listen for common user interactions
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    
    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      if (recommendationTimer) {
        clearTimeout(recommendationTimer);
      }
    };
  }, [user, checkForBias, generateRecommendation]);

  return null;
}
