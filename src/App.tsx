
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/auth/SimpleAuthProvider";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import Index from "./pages/Index";
import SimpleAuthPage from "./pages/auth/SimpleAuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import LearningDashboard from "./pages/dashboard/LearningDashboard";
import GreenSkillsPage from "./pages/dashboard/GreenSkillsPage";
import NetworkDashboard from "./pages/dashboard/NetworkDashboard";
import NetworkConnectionProfile from "./pages/dashboard/NetworkConnectionProfile";
import MentorshipDashboard from "./pages/dashboard/MentorshipDashboard";
import MentorshipDetailPage from "./pages/dashboard/MentorshipDetailPage";
import CareerTwinPage from "./pages/dashboard/CareerTwinPage";
import ArcadePage from "./pages/dashboard/ArcadePage";
import ChallengePage from "./pages/dashboard/ChallengePage";
import CourseDetailsPage from "./pages/dashboard/CourseDetailsPage";
import LearningPathPage from "./pages/dashboard/LearningPathPage";
import OpportunityMarketplace from "./pages/dashboard/OpportunityMarketplace";
import SkillsAndBadgesPage from "./pages/dashboard/SkillsAndBadgesPage";
import SkillStakingPage from "./pages/dashboard/SkillStakingPage";
import StudyBeePage from "./pages/dashboard/StudyBeePage";
import VeriSkillNetworkPage from "./pages/dashboard/VeriSkillNetworkPage";
import QuantumMatchingPage from "./pages/dashboard/QuantumMatchingPage";
import QuorumForgeDashboard from "./pages/dashboard/QuorumForgeDashboard";
import EnhancedAIDashboard from "./pages/dashboard/EnhancedAIDashboard";
import CollaborationPage from "./pages/dashboard/CollaborationPage";
import CommunityPage from "./pages/dashboard/CommunityPage";
import StudyGroupsPage from "./pages/dashboard/StudyGroupsPage";
import RealTimeChatPage from "./pages/dashboard/RealTimeChatPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import EnterpriseSecurityPage from "./pages/admin/EnterpriseSecurityPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <NavigationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<EnterpriseAuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="home" element={<DashboardPage />} />
                  <Route path="learning" element={<LearningDashboard />} />
                  <Route path="green-skills" element={<GreenSkillsPage />} />
                  <Route path="skills" element={<SkillsAndBadgesPage />} />
                  <Route path="network" element={<NetworkDashboard />} />
                  <Route path="network/:id" element={<NetworkConnectionProfile />} />
                  <Route path="mentorship" element={<MentorshipDashboard />} />
                  <Route path="mentorship/:id" element={<MentorshipDetailPage />} />
                  <Route path="opportunities" element={<OpportunityMarketplace />} />
                  <Route path="career-twin" element={<CareerTwinPage />} />
                  <Route path="arcade" element={<ArcadePage />} />
                  <Route path="challenge/:id" element={<ChallengePage />} />
                  <Route path="course/:id" element={<CourseDetailsPage />} />
                  <Route path="learning-path/:id" element={<LearningPathPage />} />
                  <Route path="staking" element={<SkillStakingPage />} />
                  <Route path="study-bee" element={<StudyBeePage />} />
                  <Route path="veriskill" element={<VeriSkillNetworkPage />} />
                  <Route path="quantum-matching" element={<QuantumMatchingPage />} />
                  <Route path="quorumforge" element={<QuorumForgeDashboard />} />
                  <Route path="enhanced-ai" element={<EnhancedAIDashboard />} />
                  <Route path="collaboration" element={<CollaborationPage />} />
                  <Route path="community" element={<CommunityPage />} />
                  <Route path="study-groups" element={<StudyGroupsPage />} />
                  <Route path="chat" element={<RealTimeChatPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="enterprise-security" element={<EnterpriseSecurityPage />} />
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </NavigationProvider>
          </BrowserRouter>
        </TooltipProvider>
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
