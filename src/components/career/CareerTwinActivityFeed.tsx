
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, FileText } from 'lucide-react';

interface ActivityLog {
  id: string;
  activity_type: string;
  created_at: string;
  user_id: string;
  metadata: any; // Changed from Record<string, any> to any to accept Json type from Supabase
}

export function CareerTwinActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchActivities = async () => {
      try {
        // Get the last 30 days of activity
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [user]);
  
  // Format the activity type to make it more readable
  const formatActivityType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const getActivityIcon = (type: string) => {
    if (type.includes('page_view')) return <FileText className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Your Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity data available yet
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {formatActivityType(activity.activity_type)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {activity.metadata.path && <div>Path: {activity.metadata.path}</div>}
                        {activity.metadata.recommendation_id && (
                          <div>Interaction with recommendation</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
