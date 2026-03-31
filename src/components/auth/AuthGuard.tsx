import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactElement, ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps): ReactElement {
  const auth = useAuth()

  if (auth?.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!auth?.isAuthenticated || !auth?.isAdminUser) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
