import { useState, useEffect, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocuments, deleteDocument, deleteDocuments, seedDocuments } from '../../services/documents'
import { documents as staticDocuments } from '../../data/documents'
import { categories } from '../../config/site'
import { useToast } from '../../contexts/ToastContext'
import SEOHead from '../../components/SEOHead'
import type { Document } from '../../types'

export default function AdminDocuments(): ReactElement {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [seeding, setSeeding] = useState(false)
  const { addToast } = useToast()

  async function loadDocs(): Promise<void> {
    try {
      const data = await fetchDocuments()
      setDocs(data)
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDocs() }, [])

  const filtered = docs.filter((doc) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(q)))
    )
  })

  const allSelected = filtered.length > 0 && filtered.every((d) => selected.has(d.id))

  function toggleAll(): void {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((d) => d.id)))
    }
  }

  function toggleOne(id: string): void {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('이 문서를 삭제하시겠습니까?')) return
    try {
      await deleteDocument(id)
      addToast('문서가 삭제되었습니다.', 'success')
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
      loadDocs()
    } catch (err) {
      addToast('삭제 실패: ' + (err as Error).message, 'error')
    }
  }

  async function handleBulkDelete(): Promise<void> {
    if (selected.size === 0) return
    if (!confirm(`선택한 ${selected.size}개 문서를 삭제하시겠습니까?`)) return
    try {
      await deleteDocuments([...selected])
      addToast(`${selected.size}개 문서가 삭제되었습니다.`, 'success')
      setSelected(new Set())
      loadDocs()
    } catch (err) {
      addToast('벌크 삭제 실패: ' + (err as Error).message, 'error')
    }
  }

  async function handleSeed(): Promise<void> {
    if (!confirm('정적 데이터(documents.js)를 Supabase에 시딩하시겠습니까?')) return
    setSeeding(true)
    try {
      await seedDocuments(staticDocuments)
      addToast('더미 데이터가 시딩되었습니다.', 'success')
      loadDocs()
    } catch (err) {
      addToast('시딩 실패: ' + (err as Error).message, 'error')
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <SEOHead title="문서 관리" />
        <div className="loading-screen"><div className="loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <SEOHead title="문서 관리" />

      <div className="admin-page-header">
        <h1 className="admin-page-title">문서 관리</h1>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? '시딩 중...' : '더미 데이터 시딩'}
          </button>
          <Link to="/admin/documents/new" className="admin-btn admin-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            새 문서
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-toolbar-search"
            placeholder="제목, 카테고리, 태그 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="admin-toolbar-spacer" />
          {selected.size > 0 && (
            <button className="admin-btn admin-btn-danger" onClick={handleBulkDelete}>
              선택 삭제 ({selected.size})
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="admin-table-check"
                      checked={allSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>페이지</th>
                  <th>용량</th>
                  <th>추가일</th>
                  <th style={{ width: 100 }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const cat = categories.find((c) => c.id === doc.category)
                  return (
                    <tr key={doc.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="admin-table-check"
                          checked={selected.has(doc.id)}
                          onChange={() => toggleOne(doc.id)}
                        />
                      </td>
                      <td>
                        <Link to={`/admin/documents/${doc.id}/edit`} className="admin-table-link">
                          {doc.title}
                        </Link>
                      </td>
                      <td>
                        <span className="admin-badge" style={{ '--badge-color': cat?.color || '#6b7280' } as React.CSSProperties}>
                          {cat?.name || doc.category}
                        </span>
                      </td>
                      <td className="admin-table-muted">{doc.pages || '-'}</td>
                      <td className="admin-table-muted">{doc.size || '-'}</td>
                      <td className="admin-table-muted">{doc.addedAt || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Link to={`/admin/documents/${doc.id}/edit`} className="admin-btn admin-btn-secondary" style={{ padding: '0.3rem 0.5rem' }}>
                            수정
                          </Link>
                          <button className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDelete(doc.id)}>
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">
            {search ? '검색 결과가 없습니다.' : '등록된 문서가 없습니다.'}
          </p>
        )}
      </div>
    </div>
  )
}
