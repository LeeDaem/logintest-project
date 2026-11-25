import { Link } from 'react-router-dom'

function Home({ user, onLogout }) {
  const displayName = user.nickname || user.name

  const stats = [
    { label: '오늘 방문', value: '1' },
    { label: '내 게시글', value: '0' },
    { label: '알림', value: '3' },
  ]

  return (
    <div className="home">
      <header className="home-header">
        <div className="brand">My App</div>
        <div className="header-right">
          <img
            className="avatar-sm"
            src={user.picture}
            alt="프로필"
            referrerPolicy="no-referrer"
          />
          <span className="header-name">{displayName}</span>
          <Link to="/mypage">마이페이지</Link>
          <button className="btn-sm" onClick={onLogout}>로그아웃</button>
        </div>
      </header>

      <main className="home-main">
        <section className="welcome">
          <h1>안녕하세요, {displayName}님 👋</h1>
          <p>구글 계정으로 로그인에 성공했어요. 이곳에서 서비스를 시작해 보세요.</p>
        </section>

        <section className="stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="info-card">
          <h2>내 계정 정보</h2>
          <dl>
            <div className="row">
              <dt>이름</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="row">
              <dt>이메일</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="row">
              <dt>이메일 인증</dt>
              <dd>{user.email_verified ? '인증됨' : '미인증'}</dd>
            </div>
            <div className="row">
              <dt>로그인 방식</dt>
              <dd>Google</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  )
}

export default Home
