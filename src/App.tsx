
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme/theme-provider';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/Index';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFound from './pages/NotFound';
import ArcadePage from './pages/dashboard/ArcadePage';
import ChallengePage from './pages/dashboard/ChallengePage';
import NetworkDashboard from './pages/dashboard/NetworkDashboard';
import CourseDetailsPage from './pages/dashboard/CourseDetailsPage';
import MentorshipDashboard from './pages/dashboard/MentorshipDashboard';
import GreenSkillsPage from './pages/dashboard/GreenSkillsPage';
import LearningDashboard from './pages/dashboard/LearningDashboard';
import CareerTwinPage from './pages/dashboard/CareerTwinPage';
import SkillsAndBadgesPage from './pages/dashboard/SkillsAndBadgesPage';
import SkillStakingPage from './pages/dashboard/SkillStakingPage';
import OpportunityMarketplace from './pages/dashboard/OpportunityMarketplace';
import MentorshipDetailPage from './pages/dashboard/MentorshipDetailPage';
import NetworkConnectionProfile from './pages/dashboard/NetworkConnectionProfile';
import CampusConnectorPage from './pages/dashboard/CampusConnectorPage';
import StudyBeePage from './pages/dashboard/StudyBeePage';
import QuorumForgeDashboard from './pages/dashboard/QuorumForgeDashboard';
import VeriSkillNetworkPage from './pages/dashboard/VeriSkillNetworkPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import PaymentsPage from './pages/admin/PaymentsPage';

// Layouts
import { AppLayout } from './components/dashboard/AppLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import AuthPage from './pages/auth/AuthPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="learning" element={<LearningDashboard />} />
                <Route path="learning/:courseId" element={<CourseDetailsPage />} />
                <Route path="network" element={<NetworkDashboard />} />
                <Route path="network/connections/:connectionId" element={<NetworkConnectionProfile />} />
                <Route path="mentorship" element={<MentorshipDashboard />} />
                <Route path="mentorship/:mentorshipId" element={<MentorshipDetailPage />} />
                <Route path="opportunities" element={<OpportunityMarketplace />} />
                <Route path="skills" element={<SkillsAndBadgesPage />} />
                <Route path="staking" element={<SkillStakingPage />} />
                <Route path="arcade" element={<ArcadePage />} />
                <Route path="arcade/challenge/:challengeId" element={<ChallengePage />} />
                <Route path="green-skills" element={<GreenSkillsPage />} />
                <Route path="career-twin" element={<CareerTwinPage />} />
                <Route path="campus" element={<CampusConnectorPage />} />
                <Route path="study-bee" element={<StudyBeePage />} />
                <Route path="quorumforge" element={<QuorumForgeDashboard />} />
                <Route path="veriskill" element={<VeriSkillNetworkPage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
