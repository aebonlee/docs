import { useState, useEffect, type ReactElement } from 'react'
import { fetchMembers } from '../../services/members'
import { isAdmin } from '../../config/admin'
import SEOHead from '../../components/SEOHead'
import type { Member } from '../../types'

export default function AdminMembers(): ReactElement {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const data = await fetchMembers()
        setMembers(data)
      } catch (err) {
        console.error('Members load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = members.filter((m) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.full_name && m.full_name.toLowerCase().includes(q))
    )
  })

  if (loading) {
    return (
      <div className="admin-page">
        <SEOHead title="회원 관리" />
        <div className="loading-screen"><div className="loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <SEOHead title="회원 관리" />

      <div className="admin-page-header">
        <h1 className="admin-page-title">회원 관리</h1>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          총 {members.length}명
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-toolbar-search"
            placeholder="이름, 이메일 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length > 0 ? (
          filtered.map((member) => (
            <div key={member.id} className="admin-member-card">
              <div className="admin-member-avatar">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" />
                ) : (
                  (member.full_name || member.email || '?').charAt(0).toUpperCase()
                )}
              </div>
              <div className="admin-member-info">
                <span className="admin-member-name">
                  {member.full_name || '(이름 없음)'}
                  {isAdmin(member.email) && (
                    <span className="admin-badge" style={{ '--badge-color': '#3b82f6', marginLeft: '0.5rem' } as React.CSSProperties}>
                      관리자
                    </span>
                  )}
                </span>
                <span className="admin-member-email">{member.email}</span>
              </div>
              <span className="admin-member-date">
                {member.created_at ? new Date(member.created_at).toLocaleDateString('ko-KR') : '-'}
              </span>
            </div>
          ))
        ) : (
          <p className="admin-empty">
            {search ? '검색 결과가 없습니다.' : members.length === 0 ? 'Supabase가 연결되지 않았거나 회원이 없습니다.' : '검색 결과가 없습니다.'}
          </p>
        )}
      </div>
    </div>
  )
}
