import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/dashboard"
        element={
          <DashboardPage />
        }
      />

      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App