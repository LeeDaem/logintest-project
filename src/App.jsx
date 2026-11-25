// src/App.jsx
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import GoogleCallback from './pages/GoogleCallback'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import MyPage from './pages/MyPage'
import './App.css'

// ===== 사용자별 추가 정보(닉네임, 전화번호, 주소)를 브라우저에 저장 =====
// 로그아웃해도 남아 있어서, 다시 로그인하면 "처음이 아님"으로 판단해요.
// (백엔드가 생기면 서버 응답으로 대체하세요)
const extraKey = (sub) => `extra:${sub}`

const loadExtra = (sub) => {
  try {
    return JSON.parse(localStorage.getItem(extraKey(sub)) || '{}')
  } catch {
    return {}
  }
}

const saveExtra = (sub, data) => {
  localStorage.setItem(extraKey(sub), JSON.stringify(data))
}

// 전화번호와 주소가 모두 있으면 추가 정보 입력 완료로 판단
const withProfileFlag = (u) => ({ ...u, profileCompleted: Boolean(u.phone && u.address) })

// 로그인이 필요한 페이지를 감싸는 가드
function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  if (!user.profileCompleted) return <Navigate to="/onboarding" replace />
  return children
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 구글 로그인 성공 시 호출
  const handleLogin = (profile) => {
    const extra = loadExtra(profile.sub) // 이전에 입력한 정보가 있으면 불러오기
    const next = withProfileFlag({ ...profile, ...extra })
    setUser(next)
    localStorage.setItem('user', JSON.stringify(next))
  }

  // 정보 수정 (닉네임, 전화번호, 주소 등)
  const handleUpdateUser = (changes) => {
    const merged = withProfileFlag({ ...user, ...changes })
    const { nickname, phone, address, addressDetail } = merged
    saveExtra(merged.sub, { nickname, phone, address, addressDetail })
    localStorage.setItem('user', JSON.stringify(merged))
    setUser(merged)
  }

  const clearSession = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  // 로그아웃: 추가 정보는 남겨 둠 (다음 로그인 때 다시 묻지 않기 위해)
  const handleLogout = () => clearSession()

  // 회원 탈퇴: 추가 정보까지 삭제 (다시 가입하면 처음부터 다시 입력)
  const handleWithdraw = () => {
    if (user) localStorage.removeItem(extraKey(user.sub))
    clearSession()
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

      {/* 구글 인증 후 돌아오는 페이지 */}
      <Route
        path="/login/oauth/google"
        element={<GoogleCallback mode="login" onLogin={handleLogin} />}
      />
      <Route
        path="/signup/oauth/google"
        element={<GoogleCallback mode="signup" onLogin={handleLogin} />}
      />

      {/* 최초 로그인 시 추가 정보 입력 */}
      <Route
        path="/onboarding"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.profileCompleted ? (
            <Navigate to="/home" replace />
          ) : (
            <Onboarding user={user} onComplete={handleUpdateUser} onLogout={handleLogout} />
          )
        }
      />

      {/* 로그인 + 추가 정보 입력이 끝나야 볼 수 있는 화면 */}
      <Route
        path="/home"
        element={
          <RequireAuth user={user}>
            <Home user={user} onLogout={handleLogout} />
          </RequireAuth>
        }
      />
      <Route
        path="/mypage"
        element={
          <RequireAuth user={user}>
            <MyPage
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onWithdraw={handleWithdraw}
            />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
    </Routes>
  )
}

export default App
