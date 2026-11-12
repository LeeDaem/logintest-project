// src/App.jsx
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import GoogleCallback from './pages/GoogleCallback'
import Home from './pages/Home'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const handleLogin = (profile) => {
    setUser(profile)
    localStorage.setItem('user', JSON.stringify(profile))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return (
    <Routes>
      {/* 로그인 / 회원가입 화면 */}
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Auth mode="login" />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/home" replace /> : <Auth mode="signup" />}
      />

      {/* 구글 인증 후 돌아오는 페이지 (redirect_uri와 경로가 같아야 함) */}
      <Route
        path="/login/oauth/google"
        element={<GoogleCallback mode="login" onLogin={handleLogin} />}
      />
      <Route
        path="/signup/oauth/google"
        element={<GoogleCallback mode="signup" onLogin={handleLogin} />}
      />

      {/* 로그인 후 화면 */}
      <Route
        path="/home"
        element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
    </Routes>
  )
}

export default App
