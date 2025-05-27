import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from "@/hooks/use-toast"

import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NetworkPage from './pages/dashboard/NetworkPage';
import LearningPage from './pages/dashboard/LearningPage';
import SkillsPage from './pages/dashboard/SkillsPage';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import AchievementsPage from './pages/dashboard/AchievementsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import AdminPage from './pages/dashboard/AdminPage';
import RealTimeChatPage from './pages/dashboard/RealTimeChatPage';
import ChatPage from './pages/dashboard/ChatPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/chat" element={<ChatPage />} />
            <Route path="/dashboard/network" element={<NetworkPage />} />
            <Route path="/dashboard/learning" element={<LearningPage />} />
            <Route path="/dashboard/skills" element={<SkillsPage />} />
            <Route path="/dashboard/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/achievements" element={<AchievementsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/admin" element={<AdminPage />} />
            <Route path="/dashboard/realtime-chat" element={<RealTimeChatPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
