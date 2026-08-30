import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RoleId } from '../types'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Card } from './ui'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: RoleId[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <Card className="max-w-md p-6 text-center border-amber-200 bg-white shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
            <ShieldAlert size={28} />
          </div>
          <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Access Restricted (RBAC Policy)
          </span>
          <h2 className="mt-2 text-base font-bold text-slate-900">Module Access Denied</h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Your authenticated role is <strong className="text-slate-900">{role.replace(/_/g, ' ')}</strong>. This module is strictly restricted to authorized enterprise roles:
            <span className="block mt-1 font-mono text-[11px] font-semibold text-slate-800 bg-slate-100 p-1.5 rounded">
              {allowedRoles.map((r) => r.replace(/_/g, ' ')).join(', ')}
            </span>
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/"
              className="rounded-xl bg-[#0c1b33] hover:bg-[#152e57] text-white py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ArrowLeft size={14} />
              Return to My Portal
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
