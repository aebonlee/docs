import { useState, useEffect, type ReactElement } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categories } from '../config/site'
import { fetchDocumentsByCategory } from '../services/documents'
import DocumentCard from '../components/DocumentCard'
import SEOHead from '../components/SEOHead'
import type { Document } from '../types'

export default function Category(): ReactElement {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categories.find((c) => c.id === categoryId)
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(): Promise<void> {
      setLoading(true)
      try {
        const data = await fetchDocumentsByCategory(categoryId!)
        setDocs(data)
      } catch (err) {
        console.error('Category load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [categoryId])

  if (!category) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <SEOHead title="카테고리를 찾을 수 없음" />
        <h2>카테고리를 찾을 수 없습니다.</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead title={category.name} description={category.description} />

      <section className="category-hero" style={{ '--cat-color': category.color } as React.CSSProperties}>
        <div className="container">
          <div className="breadcrumb" data-aos="fade-up">
            <Link to="/">홈</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{category.name}</span>
          </div>
          <h1 className="category-hero-title" data-aos="fade-up">{category.name}</h1>
          <p className="category-hero-desc" data-aos="fade-up">{category.description}</p>
          <span className="category-hero-count" data-aos="fade-up">
            {loading ? '...' : `${docs.length}개 자료`}
          </span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-screen" style={{ minHeight: '200px' }}>
              <div className="loading-spinner" />
            </div>
          ) : docs.length > 0 ? (
            <div className="document-grid">
              {docs.map((doc, i) => (
                <DocumentCard key={doc.id} doc={doc} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state" data-aos="fade-up">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <h3>아직 등록된 자료가 없습니다.</h3>
              <p>이 분야에 PDF 자료를 추가해 주세요.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
