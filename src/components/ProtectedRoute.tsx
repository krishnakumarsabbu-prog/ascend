import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RoleId } from '../types'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import { Button, Card } from './ui'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: RoleId[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, switchRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <Card className="max-w-md p-6 text-center border-amber-200 bg-amber-50/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <ShieldAlert size={24} />
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-900">Access Restricted by Role</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            This module requires one of the following roles: <br />
            <strong>{allowedRoles.join(', ')}</strong>.<br />
            Your active role is <strong>{role}</strong>.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={() => switchRole(allowedRoles[0])}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Switch to {allowedRoles[0].replace(/_/g, ' ')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
