import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import LearningDashboard from './pages/dashboard/LearningDashboard';
import CourseDetailsPage from './pages/dashboard/CourseDetailsPage';
import NetworkDashboard from './pages/dashboard/NetworkDashboard';
import NetworkConnectionProfile from './pages/dashboard/NetworkConnectionProfile';
import MentorshipDashboard from './pages/dashboard/MentorshipDashboard';
import MentorshipDetailPage from './pages/dashboard/MentorshipDetailPage';
import ArcadePage from './pages/dashboard/ArcadePage';
import ChallengePage from './pages/dashboard/ChallengePage';
import OpportunityMarketplace from './pages/dashboard/OpportunityMarketplace';
import SkillsAndBadgesPage from './pages/dashboard/SkillsAndBadgesPage';
import SkillStakingPage from './pages/dashboard/SkillStakingPage';
import GreenSkillsPage from './pages/dashboard/GreenSkillsPage';
import CareerTwinPage from './pages/dashboard/CareerTwinPage';
import StudyBeePage from './pages/dashboard/StudyBeePage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './hooks/useAuth';
import ProjectsMarketplacePage from './pages/dashboard/ProjectsMarketplacePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="learning" element={<LearningDashboard />} />
              <Route path="course/:courseId" element={<CourseDetailsPage />} />
              <Route path="network" element={<NetworkDashboard />} />
              <Route path="network/:profileId" element={<NetworkConnectionProfile />} />
              <Route path="mentorship" element={<MentorshipDashboard />} />
              <Route path="mentorship/:id" element={<MentorshipDetailPage />} />
              <Route path="arcade" element={<ArcadePage />} />
              <Route path="challenge/:challengeId" element={<ChallengePage />} />
              <Route path="marketplace" element={<OpportunityMarketplace />} />
              <Route path="skills" element={<SkillsAndBadgesPage />} />
              <Route path="staking" element={<SkillStakingPage />} />
              <Route path="green-skills" element={<GreenSkillsPage />} />
              <Route path="career-twin" element={<CareerTwinPage />} />
              <Route path="study-bee" element={<StudyBeePage />} />
              <Route path="projects-marketplace" element={<ProjectsMarketplacePage />} />
            </Route>
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
