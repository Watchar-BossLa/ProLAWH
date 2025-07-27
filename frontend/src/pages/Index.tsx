
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Trophy, Brain, Shield, Zap } from "lucide-react";
import { useEnterpriseAuth } from "@/components/auth/EnterpriseAuthProvider";
import { CONFIG, ENV } from "@/config";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading } = useEnterpriseAuth();

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated (either real user or development bypass)
      const isAuthenticated = user || (!ENV.isProduction && CONFIG.BYPASS_AUTH);
      
      if (isAuthenticated) {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Learning",
      description: "Personalized learning paths with advanced AI tutoring and real-time feedback"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Professional Network",
      description: "Connect with mentors, peers, and industry professionals worldwide"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Skill Verification",
      description: "Blockchain-verified credentials and peer-reviewed skill assessments"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with zero-trust architecture and enterprise monitoring"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "Live coding sessions, study groups, and instant messaging with voice/video"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Comprehensive Courses",
      description: "Industry-leading content from beginner to advanced levels across all domains"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-in fade-in duration-700">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🚀 Next-Generation Learning Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-6">
            ProLawh
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            The ultimate AI-native learning ecosystem combining personalized education, 
            verifiable skills, and dynamic work marketplaces
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
          
          {!ENV.isProduction && CONFIG.BYPASS_AUTH && (
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                🔧 Development Mode: Authentication bypass enabled
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in-up duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border-primary/20 animate-in fade-in-up duration-700">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of learners who are advancing their careers with AI-powered education, 
              verified credentials, and a global professional network.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Start Learning Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
