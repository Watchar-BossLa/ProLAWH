
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Lazy load dashboard pages for better performance
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const LearningDashboard = lazy(() => import("./pages/dashboard/LearningDashboard"));
const SkillsDashboard = lazy(() => import("./pages/dashboard/SkillsDashboard"));
const MentorshipDashboard = lazy(() => import("./pages/dashboard/MentorshipDashboard"));
const OpportunitiesDashboard = lazy(() => import("./pages/dashboard/OpportunitiesDashboard"));
const NetworkDashboard = lazy(() => import("./pages/dashboard/NetworkDashboard"));
const StudyGroupsPage = lazy(() => import("./pages/dashboard/StudyGroupsPage"));
const CollaborationPage = lazy(() => import("./pages/dashboard/CollaborationPage"));
const CommunityPage = lazy(() => import("./pages/dashboard/CommunityPage"));
const QuantumMatchingDashboard = lazy(() => import("./pages/dashboard/QuantumMatchingDashboard"));
const CareerTwinDashboard = lazy(() => import("./pages/dashboard/CareerTwinDashboard"));
const GreenSkillsDashboard = lazy(() => import("./pages/dashboard/GreenSkillsDashboard"));
const StakingDashboard = lazy(() => import("./pages/dashboard/StakingDashboard"));
const ArcadeDashboard = lazy(() => import("./pages/dashboard/ArcadeDashboard"));
const StudyBeeDashboard = lazy(() => import("./pages/dashboard/StudyBeeDashboard"));
const QuorumForgeDashboard = lazy(() => import("./pages/dashboard/QuorumForgeDashboard"));
const VeriSkillDashboard = lazy(() => import("./pages/dashboard/VeriSkillDashboard"));

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
            <Route index element={
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardHome />
              </Suspense>
            } />
            <Route path="learning" element={
              <Suspense fallback={<div>Loading...</div>}>
                <LearningDashboard />
              </Suspense>
            } />
            <Route path="skills" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SkillsDashboard />
              </Suspense>
            } />
            <Route path="mentorship" element={
              <Suspense fallback={<div>Loading...</div>}>
                <MentorshipDashboard />
              </Suspense>
            } />
            <Route path="opportunities" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OpportunitiesDashboard />
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
                <QuantumMatchingDashboard />
              </Suspense>
            } />
            <Route path="career-twin" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CareerTwinDashboard />
              </Suspense>
            } />
            <Route path="green-skills" element={
              <Suspense fallback={<div>Loading...</div>}>
                <GreenSkillsDashboard />
              </Suspense>
            } />
            <Route path="staking" element={
              <Suspense fallback={<div>Loading...</div>}>
                <StakingDashboard />
              </Suspense>
            } />
            <Route path="arcade" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ArcadeDashboard />
              </Suspense>
            } />
            <Route path="study-bee" element={
              <Suspense fallback={<div>Loading...</div>}>
                <StudyBeeDashboard />
              </Suspense>
            } />
            <Route path="quorumforge" element={
              <Suspense fallback={<div>Loading...</div>}>
                <QuorumForgeDashboard />
              </Suspense>
            } />
            <Route path="veriskill" element={
              <Suspense fallback={<div>Loading...</div>}>
                <VeriSkillDashboard />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
