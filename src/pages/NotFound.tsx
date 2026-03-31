import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import type { ReactElement } from 'react'

export default function NotFound(): ReactElement {
  return (
    <div className="not-found">
      <SEOHead title="404" description="페이지를 찾을 수 없습니다" />
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="btn btn-primary">홈으로 돌아가기</Link>
    </div>
  )
}
