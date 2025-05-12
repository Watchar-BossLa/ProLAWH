
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { AuthProvider } from './hooks/useAuth.tsx'
import { VeriSkillProvider } from './hooks/useVeriSkill.tsx'
import { ThemeProvider } from "@/components/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuorumForgeProvider } from "./hooks/useQuorumForge";
import { BrowserRouter as Router } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <VeriSkillProvider>
            <QuorumForgeProvider>
              <TooltipProvider>
                <App />
              </TooltipProvider>
            </QuorumForgeProvider>
          </VeriSkillProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </ThemeProvider>
);
