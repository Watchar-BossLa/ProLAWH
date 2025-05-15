import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom"
import { Shell } from "@/components/Shell"
import { Auth } from "@/pages/Auth"
import { Dashboard } from "@/pages/Dashboard"
import { NotFound } from "@/pages/NotFound"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import ArcadePage from "@/pages/dashboard/ArcadePage"
import ChallengePage from "@/pages/dashboard/ChallengePage"
import GreenSkillIndexPage from "@/pages/dashboard/GreenSkillIndexPage"

function App() {
  const { session, isLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      toast({
        title: "You are not logged in.",
        description: "Redirecting to login page.",
      })
    }
  }, [session, isLoading, toast])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Shell />}>
        <Route path="auth" element={<Auth />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="arcade" element={<ArcadePage />} />
          <Route path="challenge/:challengeId" element={<ChallengePage />} />
          <Route path="/dashboard/green-skill-index" element={<GreenSkillIndexPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
