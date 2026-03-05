import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const THEME_KEY = 'docs-theme-mode'
const COLOR_KEY = 'docs-theme-color'

export const themeColors = [
  { id: 'blue', label: '블루', value: '#3b82f6' },
  { id: 'red', label: '레드', value: '#ef4444' },
  { id: 'green', label: '그린', value: '#10b981' },
  { id: 'purple', label: '퍼플', value: '#8b5cf6' },
  { id: 'orange', label: '오렌지', value: '#f59e0b' },
]

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved || 'auto'
  })

  const [color, setColor] = useState(() => {
    const saved = localStorage.getItem(COLOR_KEY)
    return saved || 'blue'
  })

  const resolvedMode = mode === 'auto' ? getSystemTheme() : mode

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode)
    document.documentElement.setAttribute('data-theme', resolvedMode)
  }, [mode, resolvedMode])

  useEffect(() => {
    localStorage.setItem(COLOR_KEY, color)
    document.documentElement.setAttribute('data-color', color)
  }, [color])

  useEffect(() => {
    if (mode !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.setAttribute('data-theme', getSystemTheme())
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode, color, setColor, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
