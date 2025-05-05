
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
import CareerTwinPage from "@/pages/dashboard/CareerTwinPage";
import SkillStakingPage from "@/pages/dashboard/SkillStakingPage";

// Create minimal navigation components since the originals are missing
const SiteHeader = () => <header className="bg-background border-b py-4"><div className="container mx-auto">ProLawh Header</div></header>;
const SiteFooter = () => <footer className="bg-background border-t py-4 mt-auto"><div className="container mx-auto">ProLawh Footer</div></footer>;
const SiteLayout = ({ children }: { children: React.ReactNode }) => <div className="min-h-screen flex flex-col">{children}</div>;

// Create minimal page components since the originals are missing
const AuthPage = () => <div className="container mx-auto py-8">Auth Page</div>;
const HomePage = () => <div className="container mx-auto py-8">Home Page</div>;
const DashboardPage = () => <div className="container mx-auto py-8">Dashboard Page</div>;
const ProfilePage = () => <div className="container mx-auto py-8">Profile Page</div>;
const NetworkPage = () => <div className="container mx-auto py-8">Network Page</div>;
const LearningPage = () => <div className="container mx-auto py-8">Learning Page</div>;
const ChallengesPage = () => <div className="container mx-auto py-8">Challenges Page</div>;
const NotFoundPage = () => <div className="container mx-auto py-8">Not Found</div>;
const TermsOfServicePage = () => <div className="container mx-auto py-8">Terms of Service</div>;
const PrivacyPolicyPage = () => <div className="container mx-auto py-8">Privacy Policy</div>;

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
          <Route
            path="/dashboard/skill-staking"
            element={
              <ProtectedRoute>
                <SkillStakingPage />
              </ProtectedRoute>
            }
          />

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

// Create minimal CareerTwinListener component since the original is missing
const CareerTwinListener = () => null;

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to the /auth page
      navigate("/auth", { replace: true, state: { from: location } });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return <div></div>;
  }

  // Use pageTransitions from a simple object since the original might be missing
  const pageTransitions = { initial: "opacity-100 transition-opacity duration-300" };
  
  return user ? (
    <div className={`fade-in ${pageTransitions.initial}`}>{children}</div>
  ) : null;
}

export default App;
