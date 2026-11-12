// src/constants/auth.js
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const GOOGLE_SECRET = import.meta.env.VITE_GOOGLE_SECRET
export const GOOGLE_SIGNUP_REDIRECT_URI = import.meta.env.VITE_GOOGLE_SIGNUP_REDIRECT_URI
export const GOOGLE_LOGIN_REDIRECT_URI = import.meta.env.VITE_GOOGLE_LOGIN_REDIRECT_URI

// 백엔드 주소 (아직 백엔드가 없으면 .env에서 비워 두기)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const buildGoogleAuthUrl = (redirectUri, extra = {}) => {
  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'openid email profile', // 이름, 이메일, 프로필 사진까지 받기
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    ...extra,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export const GOOGLE_SIGNUP_URL = buildGoogleAuthUrl(GOOGLE_SIGNUP_REDIRECT_URI)

// prompt=consent: 로그인할 때마다 구글 로그인 창을 표시
export const GOOGLE_LOGIN_URL = buildGoogleAuthUrl(GOOGLE_LOGIN_REDIRECT_URI, {
  prompt: 'consent',
})
