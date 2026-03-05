import React from 'react'
import { Link } from 'react-router-dom'
import { siteConfig, categories } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()
  const { brand, company, footerLinks, familySites, parentSite } = siteConfig

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">
              {brand.parts.map((part, i) => (
                <span key={i} className={part.className}>{part.text}</span>
              ))}
            </h3>
            <p className="footer-desc">{siteConfig.description}</p>
            <div className="company-info">
              <p><strong>{company.name}</strong></p>
              <p>대표이사: {company.ceo}</p>
              <p>사업자등록번호: {company.bizNo}</p>
              <p>통신판매신고번호: {company.salesNo}</p>
              <p>출판사 신고번호: {company.publishNo}</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">바로가기</h4>
            <ul className="footer-list">
              {footerLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">연락처</h4>
            <div className="footer-contact">
              <p>{company.address}</p>
              <p>{company.email}</p>
              <p>{company.phone}</p>
              <p>카카오톡: {company.kakao}</p>
              <p className="business-hours">{company.hours}</p>
            </div>

            <div className="footer-family">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) window.open(e.target.value, '_blank')
                  e.target.value = ''
                }}
              >
                <option value="" disabled>Family Site</option>
                <option value={parentSite.url}>{parentSite.name} (본사이트)</option>
                {familySites.map((s, i) => (
                  <option key={i} value={s.url}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2020-{year} DreamIT Biz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
