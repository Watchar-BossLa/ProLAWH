
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import DashboardPlaceholder from "./pages/dashboard/DashboardPlaceholder";
import CareerTwinPage from "./pages/dashboard/CareerTwinPage";
import ArcadePage from "./pages/dashboard/ArcadePage";
import ChallengePage from "./pages/dashboard/ChallengePage";
import SkillStakingPage from "./pages/dashboard/SkillStakingPage";
import GreenSkillsPage from "./pages/dashboard/GreenSkillsPage";
import StudyBeePage from "./pages/dashboard/StudyBeePage";
import OpportunityMarketplace from "./pages/dashboard/OpportunityMarketplace";
import NetworkDashboard from "./pages/dashboard/NetworkDashboard";
import NetworkConnectionProfile from "./pages/dashboard/NetworkConnectionProfile";
import { AuthProvider } from "./hooks/useAuth";
import LearningDashboard from "./pages/dashboard/LearningDashboard";
import CourseDetailsPage from "./pages/dashboard/CourseDetailsPage";
import SkillsAndBadgesPage from "./pages/dashboard/SkillsAndBadgesPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="learning" element={<LearningDashboard />} />
              <Route path="learning/course/:courseId" element={<CourseDetailsPage />} />
              <Route path="skills" element={<SkillsAndBadgesPage />} />
              <Route path="mentorship" element={<DashboardPlaceholder title="Mentorship" />} />
              <Route path="opportunities" element={<OpportunityMarketplace />} />
              <Route path="arcade" element={<ArcadePage />} />
              <Route path="arcade/challenge/:challengeId" element={<ChallengePage />} />
              <Route path="career-twin" element={<CareerTwinPage />} />
              <Route path="green-skills" element={<GreenSkillsPage />} />
              <Route path="staking" element={<SkillStakingPage />} />
              <Route path="study-bee" element={<StudyBeePage />} />
              <Route path="network" element={<NetworkDashboard />} />
              <Route path="network/:connectionId" element={<NetworkConnectionProfile />} />
            </Route>
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App
