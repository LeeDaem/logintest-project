// src/api/user.js
import { API_BASE_URL } from '../constants/auth'

async function request(method, path, body) {
  const token = localStorage.getItem('accessToken')

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `서버 오류가 발생했어요. (${res.status})`)
  }

  // 응답 본문이 없는 경우(204 등)도 처리
  return res.json().catch(() => ({}))
}

// 경로는 예시이므로 실제 백엔드 API 경로에 맞게 수정하세요
export const updateNickname = (nickname) => request('PATCH', '/users/me', { nickname })
export const updateProfile = (data) => request('PATCH', '/users/me', data) // 전화번호, 주소 등
export const deleteAccount = () => request('DELETE', '/users/me')
