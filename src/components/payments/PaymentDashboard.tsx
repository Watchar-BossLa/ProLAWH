import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, X, Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export function PaymentDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        'Access to basic courses',
        'Community features',
        'Basic AI tutoring',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      popular: true,
      features: [
        'All Basic features',
        'Advanced AI tutoring',
        'Premium courses',
        'Video conferencing',
        'Priority support',
        'Skill verification'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      features: [
        'All Premium features',
        'Team management',
        'Analytics dashboard',
        'Custom integrations',
        'Dedicated support',
        'Enterprise security'
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) throw error;
      
      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Subscription Plans</h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your learning needs
          </p>
        </div>
        {subscription?.subscribed && (
          <Button onClick={handleManageSubscription} disabled={isLoading}>
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        )}
      </div>

      {subscription?.subscribed && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Current Plan: {subscription.subscription_tier}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your subscription is active until {new Date(subscription.subscription_end).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || (subscription?.subscribed && subscription?.subscription_tier === plan.name)}
              >
                {subscription?.subscribed && subscription?.subscription_tier === plan.name ? (
                  'Current Plan'
                ) : subscription?.subscribed ? (
                  'Switch Plan'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Get Started
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}