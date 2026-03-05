import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocuments, fetchCategoryCounts } from '../../services/documents'
import { categories } from '../../config/site'
import SEOHead from '../../components/SEOHead'

export default function AdminDashboard() {
  const [docs, setDocs] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [allDocs, catCounts] = await Promise.all([
          fetchDocuments(),
          fetchCategoryCounts(),
        ])
        setDocs(allDocs)
        setCounts(catCounts)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalDocs = docs.length
  const totalCategories = categories.filter((c) => (counts[c.id] || 0) > 0).length
  const recentDocs = [...docs]
    .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))
    .slice(0, 5)

  if (loading) {
    return (
      <div className="admin-page">
        <SEOHead title="관리자 대시보드" />
        <div className="loading-screen"><div className="loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <SEOHead title="관리자 대시보드" />

      <div className="admin-page-header">
        <h1 className="admin-page-title">대시보드</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalDocs}</span>
            <span className="admin-stat-label">전체 문서</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalCategories}</span>
            <span className="admin-stat-label">활성 카테고리</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{categories.length}</span>
            <span className="admin-stat-label">전체 카테고리</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">최근 문서</h2>
          <Link to="/admin/documents" className="admin-card-link">전체 보기</Link>
        </div>
        {recentDocs.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>추가일</th>
                </tr>
              </thead>
              <tbody>
                {recentDocs.map((doc) => {
                  const cat = categories.find((c) => c.id === doc.category)
                  return (
                    <tr key={doc.id}>
                      <td>
                        <Link to={`/admin/documents/${doc.id}/edit`} className="admin-table-link">
                          {doc.title}
                        </Link>
                      </td>
                      <td>
                        <span className="admin-badge" style={{ '--badge-color': cat?.color || '#6b7280' }}>
                          {cat?.name || doc.category}
                        </span>
                      </td>
                      <td className="admin-table-muted">{doc.addedAt || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">등록된 문서가 없습니다.</p>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">카테고리별 현황</h2>
        </div>
        <div className="admin-category-bars">
          {categories.map((cat) => {
            const count = counts[cat.id] || 0
            const maxCount = Math.max(...Object.values(counts), 1)
            return (
              <div key={cat.id} className="admin-cat-bar-row">
                <span className="admin-cat-bar-label">{cat.name}</span>
                <div className="admin-cat-bar-track">
                  <div
                    className="admin-cat-bar-fill"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <span className="admin-cat-bar-count">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
