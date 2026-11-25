// src/pages/Onboarding.jsx  (최초 로그인 시 추가 정보 입력)
import { useState } from 'react'
import { API_BASE_URL } from '../constants/auth'
import { updateProfile } from '../api/user'

// 숫자만 입력해도 010-1234-5678 형태로 자동 변환
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function Onboarding({ user, onComplete, onLogout }) {
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const digits = phone.replace(/\D/g, '')
    if (!/^01[016789]\d{7,8}$/.test(digits)) {
      setError('올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)')
      return
    }
    if (!address.trim()) {
      setError('주소를 입력해 주세요.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const data = {
        phone: formatPhone(digits),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
      }

      // 백엔드가 있으면 서버에 저장
      if (API_BASE_URL) await updateProfile(data)

      // 저장 성공 → 완료 처리 (App이 자동으로 /home 으로 보내줘요)
      onComplete(data)
    } catch (err) {
      setError(err.message || '저장에 실패했어요.')
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>추가 정보 입력</h1>
      <p>{user.name}님, 처음 오셨네요! 서비스 이용을 위해 추가 정보를 입력해 주세요.</p>
      <p>이메일: {user.email}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            휴대폰 번호 *<br />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="010-1234-5678"
            />
          </label>
        </div>

        <div>
          <label>
            주소 *<br />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 대구광역시 북구 대학로 80"
            />
          </label>
        </div>

        <div>
          <label>
            상세 주소<br />
            <input
              type="text"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="예: 101동 202호"
            />
          </label>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? '저장 중...' : '완료'}
        </button>
        <button type="button" onClick={onLogout}>
          취소(로그아웃)
        </button>
      </form>
    </div>
  )
}

export default Onboarding
