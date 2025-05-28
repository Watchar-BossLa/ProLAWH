
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Index from './pages/Index';
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NetworkDashboard from './pages/dashboard/NetworkDashboard';
import LearningDashboard from './pages/dashboard/LearningDashboard';
import SkillsAndBadgesPage from './pages/dashboard/SkillsAndBadgesPage';
import OpportunityMarketplace from './pages/dashboard/OpportunityMarketplace';
import AdminDashboard from './pages/admin/AdminDashboard';
import RealTimeChatPage from './pages/dashboard/RealTimeChatPage';
import ChatPage from './pages/dashboard/ChatPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/chat" element={<ChatPage />} />
          <Route path="/dashboard/network" element={<NetworkDashboard />} />
          <Route path="/dashboard/learning" element={<LearningDashboard />} />
          <Route path="/dashboard/skills" element={<SkillsAndBadgesPage />} />
          <Route path="/dashboard/projects" element={<OpportunityMarketplace />} />
          <Route path="/dashboard/achievements" element={<SkillsAndBadgesPage />} />
          <Route path="/dashboard/settings" element={<DashboardPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/realtime-chat" element={<RealTimeChatPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
