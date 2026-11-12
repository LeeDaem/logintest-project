// src/api/oauth.js
import {
  API_BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
} from '../constants/auth'

// 인가 코드(code) → 구글 토큰(access_token, id_token 등) 교환
export async function getGoogleTokens(code, redirectUri) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID || '',
      client_secret: GOOGLE_SECRET || '',
      redirect_uri: redirectUri || '',
      grant_type: 'authorization_code',
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || '토큰 발급에 실패했어요.')
  }
  return data
}

// id_token(JWT)의 payload를 해석해서 이름, 이메일 등을 꺼냄
export function decodeIdToken(idToken) {
  const base64 = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
  return JSON.parse(json)
}

// 내 백엔드 서버로 요청 보내기
async function postToServer(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `서버 오류가 발생했어요. (${res.status})`)
  }
  return res.json()
}

// 경로는 예시이므로 실제 백엔드 API 경로에 맞게 수정하세요
export const signUpUser = (data) => postToServer('/auth/signup/google', data)
export const signInUser = (data) => postToServer('/auth/login/google', data)
