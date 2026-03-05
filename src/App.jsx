import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import PublicLayout from './layouts/PublicLayout'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <PublicLayout />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
