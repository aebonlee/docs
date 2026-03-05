import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import AuthGuard from './components/auth/AuthGuard'

const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminDocuments = lazy(() => import('./pages/admin/AdminDocuments'))
const AdminDocumentForm = lazy(() => import('./pages/admin/AdminDocumentForm'))
const AdminMembers = lazy(() => import('./pages/admin/AdminMembers'))

function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="documents" element={<AdminDocuments />} />
                  <Route path="documents/new" element={<AdminDocumentForm />} />
                  <Route path="documents/:docId/edit" element={<AdminDocumentForm />} />
                  <Route path="members" element={<AdminMembers />} />
                </Route>
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
