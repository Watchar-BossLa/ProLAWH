
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'
import { AuthProvider } from './hooks/useAuth.tsx'
import { VeriSkillProvider } from './hooks/useVeriSkill.tsx'

createRoot(document.getElementById("root")!).render(
  <Router>
    <AuthProvider>
      <VeriSkillProvider>
        <App />
      </VeriSkillProvider>
    </AuthProvider>
  </Router>
);
