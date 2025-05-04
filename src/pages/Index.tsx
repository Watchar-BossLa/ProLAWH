
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Briefcase, GraduationCap, Trophy, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "AI Career Twin",
      description: "Get personalized career insights and recommendations powered by AI"
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-green-500" />,
      title: "Skill-Staking",
      description: "Stake your credentials and earn rewards as you validate your skills"
    },
    {
      icon: <Trophy className="h-10 w-10 text-amber-500" />,
      title: "Nano-Challenge Arcade",
      description: "Complete quick challenges to earn micro-credentials and badges"
    },
    {
      icon: <Users className="h-10 w-10 text-purple-500" />,
      title: "Mentorship",
      description: "Connect with industry experts for guidance and support"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-red-500" />,
      title: "Learning Paths",
      description: "Structured learning journeys tailored to your career goals"
    },
    {
      icon: <Briefcase className="h-10 w-10 text-cyan-500" />,
      title: "Work Opportunities",
      description: "Connect with employers looking for validated skills"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">ProLawh</span>
            <span className="block text-blue-700">Learning And Workforce Hub</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700">
            Empowering your journey through personalized education, verifiable skills, and dynamic work opportunities.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button 
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="rounded-md shadow"
            >
              Enter Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              variant="outline" 
              size="lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Platform Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
              Everything you need to learn, validate skills, and advance your career
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to start your journey?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-50">
            Join ProLawh today and take control of your learning and career path.
          </p>
          <div className="mt-8">
            <Button 
              onClick={() => navigate("/auth")}
              size="lg" 
              variant="secondary"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
