import { useEffect } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { AuthPage } from "@/pages/AuthPage";
import { HomePage } from "@/pages/HomePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { NetworkPage } from "@/pages/NetworkPage";
import { LearningPage } from "@/pages/LearningPage";
import { ChallengesPage } from "@/pages/ChallengesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { pageTransitions } from "@/lib/transitions";
import { CareerTwinPage } from "@/pages/dashboard/CareerTwinPage";
import { CareerTwinListener } from "@/components/career/CareerTwinListener";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { SkillStakingPage } from "@/pages/dashboard/SkillStakingPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteHeader />
      <PageContent />
      <SiteFooter />
    </BrowserRouter>
  );
}

function PageContent() {
  const { user } = useAuth();
  const { trackActivity } = useActivityTracker();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view when component mounts
    trackActivity("page_view", { path: location.pathname });
  }, [trackActivity, location.pathname]);

  // Redirect to profile page if user is new
  useEffect(() => {
    if (user?.user_metadata?.new_user) {
      navigate("/dashboard/profile");
    }
  }, [user, navigate]);

  return (
    <div className="bg-background">
      <SiteLayout>
        <CareerTwinListener />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />

          {/* Dashboard Routes - Requires Authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/network"
            element={
              <ProtectedRoute>
                <NetworkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/learning"
            element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/challenges"
            element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/career-twin"
            element={
              <ProtectedRoute>
                <CareerTwinPage />
              </ProtectedRoute>
            }
          />
          {
            path: "/dashboard/skill-staking",
            element: <SkillStakingPage />
          },

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SiteLayout>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      // Redirect to the /auth page
      navigate("/auth", { replace: true, state: { from: location } });
    }
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    return <div></div>;
  }

  return session ? (
    <div className={`fade-in ${pageTransitions.initial}`}>{children}</div>
  ) : null;
}

export default App;
