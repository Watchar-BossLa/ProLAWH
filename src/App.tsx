
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

// Lazy load existing dashboard pages
const LearningDashboard = lazy(() => import("./pages/dashboard/LearningDashboard"));
const MentorshipDashboard = lazy(() => import("./pages/dashboard/MentorshipDashboard"));
const NetworkDashboard = lazy(() => import("./pages/dashboard/NetworkDashboard"));
const StudyGroupsPage = lazy(() => import("./pages/dashboard/StudyGroupsPage"));
const CollaborationPage = lazy(() => import("./pages/dashboard/CollaborationPage"));
const CommunityPage = lazy(() => import("./pages/dashboard/CommunityPage"));
const QuantumMatchingPage = lazy(() => import("./pages/dashboard/QuantumMatchingPage"));
const CareerTwinPage = lazy(() => import("./pages/dashboard/CareerTwinPage"));
const GreenSkillsPage = lazy(() => import("./pages/dashboard/GreenSkillsPage"));
const ArcadePage = lazy(() => import("./pages/dashboard/ArcadePage"));
const StudyBeePage = lazy(() => import("./pages/dashboard/StudyBeePage"));
const VeriSkillNetworkPage = lazy(() => import("./pages/dashboard/VeriSkillNetworkPage"));
const SkillsAndBadgesPage = lazy(() => import("./pages/dashboard/SkillsAndBadgesPage"));
const OpportunityMarketplace = lazy(() => import("./pages/dashboard/OpportunityMarketplace"));
const SkillStakingPage = lazy(() => import("./pages/dashboard/SkillStakingPage"));
const QuorumForgeDashboard = lazy(() => import("./pages/dashboard/QuorumForgeDashboard"));
const EnhancedAIDashboard = lazy(() => import("./pages/dashboard/EnhancedAIDashboard"));
const RealTimeChatPage = lazy(() => import("./pages/dashboard/RealTimeChatPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="learning" element={
              <Suspense fallback={<div>Loading...</div>}>
                <LearningDashboard />
              </Suspense>
            } />
            <Route path="skills" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SkillsAndBadgesPage />
              </Suspense>
            } />
            <Route path="mentorship" element={
              <Suspense fallback={<div>Loading...</div>}>
                <MentorshipDashboard />
              </Suspense>
            } />
            <Route path="opportunities" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OpportunityMarketplace />
              </Suspense>
            } />
            <Route path="network" element={
              <Suspense fallback={<div>Loading...</div>}>
                <NetworkDashboard />
              </Suspense>
            } />
            <Route path="study-groups" element={
              <Suspense fallback={<div>Loading...</div>}>
                <StudyGroupsPage />
              </Suspense>
            } />
            <Route path="collaboration" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CollaborationPage />
              </Suspense>
            } />
            <Route path="community" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CommunityPage />
              </Suspense>
            } />
            <Route path="quantum-matching" element={
              <Suspense fallback={<div>Loading...</div>}>
                <QuantumMatchingPage />
              </Suspense>
            } />
            <Route path="career-twin" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CareerTwinPage />
              </Suspense>
            } />
            <Route path="green-skills" element={
              <Suspense fallback={<div>Loading...</div>}>
                <GreenSkillsPage />
              </Suspense>
            } />
            <Route path="staking" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SkillStakingPage />
              </Suspense>
            } />
            <Route path="arcade" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ArcadePage />
              </Suspense>
            } />
            <Route path="study-bee" element={
              <Suspense fallback={<div>Loading...</div>}>
                <StudyBeePage />
              </Suspense>
            } />
            <Route path="quorumforge" element={
              <Suspense fallback={<div>Loading...</div>}>
                <QuorumForgeDashboard />
              </Suspense>
            } />
            <Route path="veriskill" element={
              <Suspense fallback={<div>Loading...</div>}>
                <VeriSkillNetworkPage />
              </Suspense>
            } />
            <Route path="enhanced-ai" element={
              <Suspense fallback={<div>Loading...</div>}>
                <EnhancedAIDashboard />
              </Suspense>
            } />
            <Route path="chat" element={
              <Suspense fallback={<div>Loading...</div>}>
                <RealTimeChatPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
