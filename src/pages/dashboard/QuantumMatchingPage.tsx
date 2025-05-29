
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuantumMatchingDashboard } from "@/components/quantum/QuantumMatchingDashboard";
import { AgentNotificationPanel } from "@/components/ai/AgentNotificationPanel";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Atom, Brain, Sparkles } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function QuantumMatchingPage() {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [careerGoals, setCareerGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user skills
        const { data: skillsData } = await supabase
          .from('user_skills')
          .select(`
            skill_id,
            skills (
              id,
              name
            )
          `)
          .eq('user_id', user.id);

        if (skillsData) {
          const skills = skillsData.map(item => item.skill_id);
          setUserSkills(skills);
        }

        // Fetch career recommendations as goals
        const { data: recommendationsData } = await supabase
          .from('career_recommendations')
          .select('skills')
          .eq('user_id', user.id)
          .limit(5);

        if (recommendationsData) {
          const goals = recommendationsData.flatMap(rec => rec.skills || []);
          setCareerGoals([...new Set(goals)]); // Remove duplicates
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <PageWrapper
        title="Quantum AI Matching"
        description="Experience the future of skill matching with quantum-enhanced algorithms and AI assistance"
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Atom className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Preparing quantum systems...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Quantum AI Matching"
      description="Experience the future of skill matching with quantum-enhanced algorithms and AI assistance"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills in Quantum State</CardTitle>
            <Atom className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSkills.length}</div>
            <p className="text-xs text-muted-foreground">
              Skills prepared for quantum entanglement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Goals</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careerGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-identified pathways
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Quantum coherence maintained
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quantum Matching Dashboard */}
        <div className="lg:col-span-2">
          <QuantumMatchingDashboard 
            userSkills={userSkills}
            careerGoals={careerGoals}
          />
        </div>

        {/* AI Assistant Panel */}
        <div className="lg:col-span-1">
          <AgentNotificationPanel />
        </div>
      </div>

      {/* Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How Quantum AI Matching Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Quantum Skill Entanglement</h4>
              <p className="text-sm text-muted-foreground">
                Your skills are represented as quantum states that can be entangled with other skills, 
                creating superposition states that reveal hidden relationships and synergies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Agent Intelligence</h4>
              <p className="text-sm text-muted-foreground">
                Autonomous AI agents continuously learn from your interactions, proactively identifying 
                opportunities and providing personalized recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quantum Advantage</h4>
              <p className="text-sm text-muted-foreground">
                Quantum interference patterns reveal match qualities impossible to detect with 
                classical algorithms, leading to superior accuracy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Adaptive Learning</h4>
              <p className="text-sm text-muted-foreground">
                The system evolves based on your feedback, continuously improving its understanding 
                of your preferences and career goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
