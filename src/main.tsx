
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { VeriSkillProvider } from './hooks/useVeriSkill.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <VeriSkillProvider>
      <App />
    </VeriSkillProvider>
  </QueryClientProvider>
);
