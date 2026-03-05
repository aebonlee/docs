import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthGuard({ children }) {
  const { isAuthenticated, isAdminUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdminUser) {
    return <Navigate to="/" replace />
  }

  return children
}
