import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'

function Login({ onLogin }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        if (!res.ok) throw new Error('userinfo failed')
        const profile = await res.json()
      // 아래 코드는 회원정보를 서버로 보내는 역할
        await fetch('http://localhost:8080/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          sub: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          }),
        })
      // 프로필에 이름, 이메일, 프로필사진, 구글 고유 사용자 ID, 이메일 인증여부
        onLogin(profile) // 로그인 성공 → App에서 /home으로 자동 이동
      } catch {
        setError('사용자 정보를 가져오지 못했어요.')
        setLoading(false)
      }
    },
    onError: () => setError('구글 로그인에 실패했어요.'),
    onNonOAuthError: () => setError('로그인 팝업이 닫혔어요. 다시 시도해 주세요.'),
  })

  return (
    <div className="login-page">
      <div className="card">
        <h1>로그인</h1>
        <p className="desc">소셜 계정으로 간편하게 시작하세요</p>
        <button className="btn google" onClick={() => login()} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/>
            <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
          </svg>
          {loading ? '로그인 중...' : 'Google로 계속하기'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}


export default Login
