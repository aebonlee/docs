import React from 'react'
import { Link } from 'react-router-dom'
import { siteConfig, categories } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">{siteConfig.logo}</Link>
            <p className="footer-desc">{siteConfig.description}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">분야</h4>
            <ul className="footer-list">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">더보기</h4>
            <ul className="footer-list">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
              {siteConfig.footer.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {siteConfig.footer.copyright}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
