
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductionAuth } from "@/components/auth/ProductionAuthProvider";
import { ENV } from "@/config";

interface LocationState {
  returnUrl?: string;
}

export default function ProductionAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useProductionAuth();
  
  const state = location.state as LocationState;
  const returnUrl = state?.returnUrl || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const userData = fullName ? { full_name: fullName } : undefined;
        const result = await signUp(email, password, userData);
        
        if (result?.error) {
          throw new Error(result.error.message);
        }
        
        toast({
          title: "Account Created",
          description: ENV.isProduction 
            ? "Please check your email to verify your account before signing in."
            : "Account created successfully. You can now sign in.",
        });
        
        if (!ENV.isProduction) {
          setIsSignUp(false);
          setPassword("");
        }
      } else {
        const result = await signIn(email, password);
        
        if (result?.error) {
          throw new Error(result.error.message);
        }
        
        // Navigation will happen automatically via useEffect when user state updates
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during authentication";
      
      // Provide helpful error messages
      let friendlyMessage = errorMessage;
      if (errorMessage.includes("Email logins are disabled")) {
        friendlyMessage = "Email authentication is not enabled. Please contact support.";
      } else if (errorMessage.includes("Signups not allowed")) {
        friendlyMessage = "New account registration is currently disabled. Please contact support.";
      } else if (errorMessage.includes("Invalid login credentials")) {
        friendlyMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (errorMessage.includes("Email not confirmed")) {
        friendlyMessage = "Please check your email and click the verification link before signing in.";
      }
      
      setError(friendlyMessage);
      toast({
        title: "Authentication Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setPassword("");
                }}
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
