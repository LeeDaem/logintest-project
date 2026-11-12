// src/pages/GoogleCallback.jsx
// 구글 인증이 끝나면 돌아오는 페이지 (/login/oauth/google, /signup/oauth/google)
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  API_BASE_URL,
  GOOGLE_LOGIN_REDIRECT_URI,
  GOOGLE_SIGNUP_REDIRECT_URI,
} from '../constants/auth'
import { getGoogleTokens, decodeIdToken, signInUser, signUpUser } from '../api/oauth'

function GoogleCallback({ mode, onLogin }) {
  const isSignup = mode === 'signup'
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  // 개발 모드(StrictMode)에서 effect가 두 번 실행돼도 code는 한 번만 쓰도록 막음
  // (인가 코드는 1회용이라 두 번 쓰면 invalid_grant 에러가 나요)
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const code = searchParams.get('code')
    if (!code) {
      setError('인가 코드가 없어요. 로그인을 다시 시도해 주세요.')
      return
    }

    const handleOAuthCallback = async () => {
      try {
        const redirectUri = isSignup ? GOOGLE_SIGNUP_REDIRECT_URI : GOOGLE_LOGIN_REDIRECT_URI

        // 1) 인가 코드로 구글 토큰 발급
        const tokenResponse = await getGoogleTokens(code, redirectUri)
        const idToken = tokenResponse.id_token

        // 2) id_token에서 사용자 정보 꺼내기
        const google = decodeIdToken(idToken)
        const profile = {
          sub: google.sub,
          name: google.name,
          email: google.email,
          email_verified: google.email_verified,
          picture: google.picture,
        }

        // 3) 백엔드가 있으면 id_token을 보내서 회원가입 / 로그인 처리
        if (API_BASE_URL) {
          const result = isSignup
            ? await signUpUser({ nickname: google.name, redirectUri, token: idToken })
            : await signInUser({ redirectUri, token: idToken })

          if (result.accessToken) localStorage.setItem('accessToken', result.accessToken)
          if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken)
        }

        // 4) 로그인 상태로 만들고 홈으로 이동
        onLogin(profile)
        navigate('/home', { replace: true })
      } catch (e) {
        console.error(isSignup ? '회원가입 오류:' : '로그인 오류:', e)
        setError(e.message || '알 수 없는 오류가 발생했어요.')
      }
    }

    handleOAuthCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="login-page">
        <div className="card">
          <h1>{isSignup ? '회원가입 실패' : '로그인 실패'}</h1>
          <p className="error">{error}</p>
          <p style={{ marginTop: 20, fontSize: 13 }}>
            <Link to={isSignup ? '/signup' : '/login'}>다시 시도하기</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="card">
        <p className="desc" style={{ margin: 0 }}>
          {isSignup ? '회원가입 처리 중...' : '로그인 처리 중...'}
        </p>
      </div>
    </div>
  )
}

export default GoogleCallback
