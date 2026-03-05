import React from 'react'
import { categories } from '../config/site'
import { documents } from '../data/documents'
import CategoryCard from '../components/CategoryCard'
import DocumentCard from '../components/DocumentCard'
import SEOHead from '../components/SEOHead'

export default function Home() {
  const recentDocs = [...documents]
    .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))
    .slice(0, 6)

  return (
    <>
      <SEOHead
        title="홈"
        description="분야별 학습 자료를 정리하고 바로 열람할 수 있는 문서 라이브러리"
      />

      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title" data-aos="fade-up">
            Docs Library
          </h1>
          <p className="hero-subtitle" data-aos="fade-up">
            분야별 학습 자료를 한곳에서 정리하고 바로 열람하세요.
          </p>
          <div className="hero-stats" data-aos="fade-up">
            <div className="stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">분야</span>
            </div>
            <div className="stat">
              <span className="stat-number">{documents.length}</span>
              <span className="stat-label">자료</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">분야별 카테고리</h2>
          <div className="category-grid">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {recentDocs.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">최근 추가된 자료</h2>
            <div className="document-grid">
              {recentDocs.map((doc, i) => (
                <DocumentCard key={doc.id} doc={doc} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
