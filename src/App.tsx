import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'

function CatchAll() {
  const location = useLocation()
  // Catch OAI resolution links
  if (location.pathname.startsWith('/16.')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.yaylabs.dev/api'
    // Remove the '/api' suffix to get the base backend URL
    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
    window.location.replace(`${baseUrl}${location.pathname}${location.search}`)
    return null
  }
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="*" element={<CatchAll />} />
    </Routes>
  )
}
