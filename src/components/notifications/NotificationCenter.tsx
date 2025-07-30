import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMockNotifications();
    }
  }, [user]);

  const fetchMockNotifications = () => {
    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Course Completed!',
        message: 'Congratulations! You have completed the JavaScript Fundamentals course.',
        type: 'success',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        action_url: '/dashboard/learning'
      },
      {
        id: '2',
        title: 'New Mentor Match',
        message: 'You have been matched with a new mentor in React development.',
        type: 'info',
        read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        action_url: '/dashboard/mentorship'
      },
      {
        id: '3',
        title: 'Study Group Invitation',
        message: 'You have been invited to join the Advanced React study group.',
        type: 'info',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    const wasUnread = notifications.find(n => n.id === notificationId)?.read === false;
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors ${
                        !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-primary/20"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-destructive/20"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            
                            {notification.action_url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-xs px-2"
                                onClick={() => {
                                  if (notification.action_url?.startsWith('/')) {
                                    window.location.href = notification.action_url;
                                  } else {
                                    window.open(notification.action_url, '_blank');
                                  }
                                  setIsOpen(false);
                                }}
                              >
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}