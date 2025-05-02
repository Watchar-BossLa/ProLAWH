
import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import { ThemeProvider } from './components/theme/theme-provider'
import { Toaster } from "./components/ui/toaster"
import Index from './pages/Index'
import DashboardHome from './pages/dashboard/DashboardHome'
import NotFound from './pages/NotFound'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import UsersPage from './pages/admin/UsersPage'
import SettingsPage from './pages/admin/SettingsPage'
import ProjectsMarketplacePage from './pages/dashboard/ProjectsMarketplacePage'
import { AuthProvider } from './hooks/useAuth'
import CareerTwinPage from './pages/dashboard/CareerTwinPage'
import GreenSkillsPage from './pages/dashboard/GreenSkillsPage'
import SkillStakingPage from './pages/dashboard/SkillStakingPage'
import ArcadePage from './pages/dashboard/ArcadePage'

// Add an accessibility component for keyboard navigation
function SkipToContent() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }))

  // Make sure accessibility settings are applied on initial load
  React.useEffect(() => {
    // Check stored preferences
    const highContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    const reducedMotion = localStorage.getItem('accessibility-reducedMotion') === 'true' || 
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply classes right away to prevent flash of unstyled content
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Apply theme preference
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'dynamic') {
      document.documentElement.classList.add('dynamic');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <AuthProvider>
          <BrowserRouter>
            <SkipToContent />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="projects" element={<ProjectsMarketplacePage />} />
                <Route path="career-twin" element={<CareerTwinPage />} />
                <Route path="green-skills" element={<GreenSkillsPage />} />
                <Route path="skill-staking" element={<SkillStakingPage />} />
                <Route path="arcade" element={<ArcadePage />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
