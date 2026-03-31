import { useState, type ReactElement, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps): ReactElement | null {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth?.signInWithEmail(email, password)
      onClose()
    } catch (err) {
      setError((err as Error).message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(): Promise<void> {
    setError('')
    try {
      await auth?.signInWithGoogle()
    } catch (err) {
      setError((err as Error).message || 'Google 로그인에 실패했습니다.')
    }
  }

  async function handleKakao(): Promise<void> {
    setError('')
    try {
      await auth?.signInWithKakao()
    } catch (err) {
      setError((err as Error).message || '카카오 로그인에 실패했습니다.')
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="auth-title">로그인</h2>
        <p className="auth-subtitle">소셜 계정 또는 이메일로 로그인하세요.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-social">
          <button type="button" className="auth-social-btn auth-kakao" onClick={handleKakao}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.62 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.42 4.28-2.84.56.08 1.14.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
            </svg>
            카카오로 로그인
          </button>
          <button type="button" className="auth-social-btn auth-google" onClick={handleGoogle}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google로 로그인
          </button>
        </div>

        <div className="auth-divider">
          <span>또는</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="auth-email">이메일</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">비밀번호</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '로그인 중...' : '이메일로 로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
