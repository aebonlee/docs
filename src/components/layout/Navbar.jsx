import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { useTheme, themeColors } from '../../contexts/ThemeContext'
import { searchDocuments } from '../../data/documents'

export default function Navbar() {
  const { mode, setMode, color, setColor } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const settingsRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchDocuments(searchQuery))
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSettingsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const cycleMode = () => {
    const modes = ['light', 'dark', 'auto']
    const next = modes[(modes.indexOf(mode) + 1) % modes.length]
    setMode(next)
  }

  const modeLabel = mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'Auto'

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            {siteConfig.brand.parts.map((part, i) => (
              <span key={i} className={part.className}>{part.text}</span>
            ))}
          </Link>

          <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link${location.pathname === item.path ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              className="navbar-btn"
              onClick={() => setSearchOpen(true)}
              title="검색 (Ctrl+K)"
              aria-label="검색"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="navbar-settings-wrap" ref={settingsRef}>
              <button
                className="navbar-btn"
                onClick={() => setSettingsOpen(!settingsOpen)}
                title="설정"
                aria-label="설정"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              {settingsOpen && (
                <div className="navbar-settings">
                  <div className="settings-section">
                    <span className="settings-label">테마 모드</span>
                    <button className="settings-mode-btn" onClick={cycleMode}>
                      {modeLabel}
                    </button>
                  </div>
                  <div className="settings-section">
                    <span className="settings-label">테마 색상</span>
                    <div className="settings-colors">
                      {themeColors.map((c) => (
                        <button
                          key={c.id}
                          className={`color-dot${color === c.id ? ' active' : ''}`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => setColor(c.id)}
                          title={c.label}
                          aria-label={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              className="navbar-btn"
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴"
            >
              <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="문서 검색... (제목, 설명, 태그)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
              <kbd className="search-kbd">ESC</kbd>
            </div>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((doc) => (
                  <button
                    key={doc.id}
                    className="search-result-item"
                    onClick={() => {
                      navigate(`/view/${doc.id}`)
                      setSearchOpen(false)
                    }}
                  >
                    <span className="search-result-title">{doc.title}</span>
                    <span className="search-result-desc">{doc.description}</span>
                  </button>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="search-empty">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
