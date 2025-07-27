
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ENV, CONFIG } from "@/config";

interface LocationState {
  returnUrl?: string;
}

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const returnUrl = state?.returnUrl || "/dashboard";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account Created",
          description: ENV.isProduction 
            ? "Please check your email to verify your account."
            : "Account created successfully. You can now sign in.",
        });
        
        if (!ENV.isProduction) {
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        navigate(returnUrl);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassAuth = () => {
    navigate(returnUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your details to create your account"
              : "Enter your credentials to access your account"}
          </CardDescription>
          {returnUrl !== "/dashboard" && (
            <div className="py-2 px-3 bg-muted/50 rounded-md text-sm">
              You'll be redirected to {returnUrl.replace("/dashboard/", "")} after login
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!ENV.isProduction && CONFIG.BYPASS_AUTH && (
            <Alert variant="warning" className="mb-4 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                Authentication is currently bypassed for development. 
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 bg-amber-200 hover:bg-amber-300 dark:bg-amber-800 dark:hover:bg-amber-700 border-amber-300"
                  onClick={handleBypassAuth}
                >
                  Continue to {returnUrl.replace("/dashboard/", "") || "Dashboard"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : isSignUp ? (
                  <><UserPlus className="h-4 w-4 mr-2" /> Create Account</>
                ) : (
                  <><LogIn className="h-4 w-4 mr-2" /> Sign In</>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full transition-colors duration-200"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
