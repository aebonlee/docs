import React, { useState } from 'react'

export default function PDFViewer({ src, title }) {
  const [loadError, setLoadError] = useState(false)

  return (
    <div className="pdf-viewer">
      {!loadError ? (
        <iframe
          src={src}
          title={title}
          className="pdf-iframe"
          onError={() => setLoadError(true)}
        />
      ) : (
        <div className="pdf-fallback">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p>PDF를 미리보기할 수 없습니다.</p>
          <a href={src} download className="btn btn-primary">
            다운로드
          </a>
        </div>
      )}
    </div>
  )
}
