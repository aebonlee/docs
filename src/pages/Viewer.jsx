import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categories } from '../config/site'
import { fetchDocumentById } from '../services/documents'
import PDFViewer from '../components/PDFViewer'
import SEOHead from '../components/SEOHead'

export default function Viewer() {
  const { docId } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchDocumentById(docId)
        setDoc(data)
      } catch (err) {
        console.error('Viewer load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [docId])

  if (loading) {
    return (
      <div className="loading-screen">
        <SEOHead title="문서 로딩중..." />
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <SEOHead title="문서를 찾을 수 없음" />
        <h2>문서를 찾을 수 없습니다.</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.id === doc.category)
  const pdfUrl = doc.fileUrl || `${import.meta.env.BASE_URL}pdfs/${doc.category}/${doc.fileName}`

  return (
    <>
      <SEOHead title={doc.title} description={doc.description} />

      <div className="viewer-page">
        <div className="viewer-header">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">홈</Link>
              <span className="breadcrumb-sep">/</span>
              {category && (
                <>
                  <Link to={`/category/${category.id}`}>{category.name}</Link>
                  <span className="breadcrumb-sep">/</span>
                </>
              )}
              <span>{doc.title}</span>
            </div>
            <div className="viewer-title-row">
              <h1 className="viewer-title">{doc.title}</h1>
              <div className="viewer-actions">
                <a href={pdfUrl} download className="btn btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  다운로드
                </a>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  새 탭에서 열기
                </a>
              </div>
            </div>
            <p className="viewer-desc">{doc.description}</p>
            <div className="viewer-meta">
              {doc.pages && <span>{doc.pages}페이지</span>}
              {doc.size && <span>{doc.size}</span>}
              {doc.addedAt && <span>추가일: {doc.addedAt}</span>}
            </div>
            {doc.tags && doc.tags.length > 0 && (
              <div className="viewer-tags">
                {doc.tags.map((tag) => (
                  <span key={tag} className="document-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <PDFViewer src={pdfUrl} title={doc.title} />
      </div>
    </>
  )
}
