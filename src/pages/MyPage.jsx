// src/pages/MyPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../constants/auth'
import { updateNickname, deleteAccount } from '../api/user'

function MyPage({ user, onUpdateUser, onLogout, onWithdraw }) {
  const [nickname, setNickname] = useState(user.nickname || user.name || '')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  // 닉네임 수정
  const handleSave = async (e) => {
    e.preventDefault()
    const trimmed = nickname.trim()

    if (!trimmed) {
      setMessage('닉네임을 입력해 주세요.')
      return
    }
    if (trimmed.length > 20) {
      setMessage('닉네임은 20자 이하로 입력해 주세요.')
      return
    }

    setSaving(true)
    setMessage('')
    try {
      if (API_BASE_URL) await updateNickname(trimmed)
      onUpdateUser({ nickname: trimmed })
      setMessage('저장되었습니다.')
    } catch (err) {
      setMessage(err.message || '저장에 실패했어요.')
    } finally {
      setSaving(false)
    }
  }

  // 회원 탈퇴
  const handleWithdraw = async () => {
    const ok = window.confirm('정말 탈퇴하시겠어요? 이 작업은 되돌릴 수 없어요.')
    if (!ok) return

    try {
      if (API_BASE_URL) await deleteAccount()
      onWithdraw() // 저장된 정보까지 삭제 → 자동으로 /login 으로 이동
    } catch (err) {
      setMessage(err.message || '탈퇴 처리에 실패했어요.')
    }
  }

  return (
    <div>
      <h1>마이페이지</h1>
      <p>
        <Link to="/home">← 홈으로</Link>
      </p>

      <h2>내 정보</h2>
      {user.picture && (
        <img src={user.picture} alt="프로필" width="80" height="80" referrerPolicy="no-referrer" />
      )}
      <ul>
        <li>이름: {user.name}</li>
        <li>닉네임: {user.nickname || user.name}</li>
        <li>이메일: {user.email}</li>
        <li>이메일 인증: {user.email_verified ? '인증됨' : '미인증'}</li>
        <li>휴대폰 번호: {user.phone}</li>
        <li>
          주소: {user.address} {user.addressDetail}
        </li>
        <li>로그인 방식: Google</li>
      </ul>

      <h2>닉네임 수정</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="닉네임"
        />
        <button type="submit" disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </button>
      </form>
      {message && <p>{message}</p>}

      <h2>계정</h2>
      <button onClick={onLogout}>로그아웃</button>
      <button onClick={handleWithdraw}>회원 탈퇴</button>
    </div>
  )
}

export default MyPage
