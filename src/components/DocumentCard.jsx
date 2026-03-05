import React from 'react'
import { Link } from 'react-router-dom'

export default function DocumentCard({ doc, index }) {
  return (
    <Link
      to={`/view/${doc.id}`}
      className="document-card"
      data-aos="fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="document-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <div className="document-info">
        <h3 className="document-title">{doc.title}</h3>
        <p className="document-desc">{doc.description}</p>
        <div className="document-meta">
          {doc.pages && <span>{doc.pages}p</span>}
          {doc.size && <span>{doc.size}</span>}
          {doc.addedAt && <span>{doc.addedAt}</span>}
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <div className="document-tags">
            {doc.tags.map((tag) => (
              <span key={tag} className="document-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
