import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from "./pages/AuthCallbackPage"
import AppLayout from "./components/AppLayout"
import ApplicationsPage from "./pages/ApplicationsPage"

// function PrivateRoute({ children }: { children: React.ReactNode }) {
//   const token = localStorage.getItem('jwt')
//   return token ? <>{children}</> : <Navigate to="/login" replace />
// }

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route
        element={
          // <PrivateRoute>
          <AppLayout />
          // </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App