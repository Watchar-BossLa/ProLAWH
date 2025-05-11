
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { VeriSkillProvider } from './hooks/useVeriSkill.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <VeriSkillProvider>
        <App />
      </VeriSkillProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
