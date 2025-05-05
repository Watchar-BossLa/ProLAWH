
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Star } from 'lucide-react';
import { useCareerTwin } from '@/hooks/useCareerTwin';
import { Link } from 'react-router-dom';

interface CareerTwinRecommendationNotificationProps {
  onClose?: () => void;
}

export function CareerTwinRecommendationNotification({ 
  onClose 
}: CareerTwinRecommendationNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { recommendations, trackActivity } = useCareerTwin();

  // Only show the most recent recommendation that's in 'pending' status
  const latestRecommendation = recommendations?.find(rec => rec.status === 'pending');
  
  useEffect(() => {
    // If we have a new recommendation, show the notification
    if (latestRecommendation) {
      setIsVisible(true);
      
      // Track that the recommendation was shown
      trackActivity('recommendation_viewed', { 
        recommendation_id: latestRecommendation.id 
      });
      
      // Auto-hide the notification after 15 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [latestRecommendation, trackActivity]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  const handleViewDetails = () => {
    trackActivity('recommendation_clicked', { 
      recommendation_id: latestRecommendation?.id 
    });
    setIsVisible(false);
  };
  
  if (!isVisible || !latestRecommendation) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card rounded-lg shadow-lg border border-border z-50 transition-all duration-300 animate-in slide-in-from-right">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <h4 className="font-semibold text-sm">AI Career Twin Insight</h4>
          </div>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {latestRecommendation.recommendation}
        </p>
        
        <div className="flex justify-end">
          <Button 
            size="sm" 
            variant="default" 
            as={Link}
            to="/dashboard/career-twin"
            onClick={handleViewDetails}
            className="text-xs flex items-center"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
