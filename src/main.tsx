
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'
import { VeriSkillProvider } from './hooks/useVeriSkill.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VeriSkillProvider>
          <App />
        </VeriSkillProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
