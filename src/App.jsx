import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/UseAuth'
import { usePlatform } from './hooks/usePlatform'
import WebLayout from './components/layout/WebLayout'
import MobileLayout from './components/layout/MobileLayout'
import AuthPage from './pages/Auth'
import LandingPage from './pages/Landing'
import OAuthGoogleCallbackPage from './pages/OAuthGoogleCallback'
import HomePage from './pages/Home'
import LoadingScreen from './components/LoadingScreen'
import ConfigurePage from './pages/Configure'
import QuizPage from './pages/Quiz'
import ResultsPage from './pages/Result'
import HistoryPage from './pages/History'
import ProfilePage from './pages/Profile'
import './App.css'

function AppRoutes() {
  const { user, loading } = useAuth()
  const { isMobile } = usePlatform()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingScreen message="Starting up…" />
  }

  // Auth page — full screen, no layout
  if (!user) {
    return (
      <div key={location.pathname} className="vb-page-transition">
        <Routes>
          {isMobile
            ? (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/oauth/google/callback" element={<OAuthGoogleCallbackPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )
            : (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/oauth/google/callback" element={<OAuthGoogleCallbackPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
        </Routes>
      </div>
    )
  }

  // Quiz page — full screen, no sidebar layout (has its own layout)
  const isQuizRoute = location.pathname.startsWith('/quiz/')

  if (isQuizRoute) {
    return (
      <div key={location.pathname} className="vb-page-transition">
        <Routes>
          <Route path="/quiz/:sessionId" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    )
  }

  // App pages — with sidebar/bottom-nav layout
  const Layout = isMobile ? MobileLayout : WebLayout

  return (
    <Layout>
      <div key={location.pathname} className="vb-page-transition">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/configure/:uploadId" element={<ConfigurePage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
