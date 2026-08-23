import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { api } from './lib/api'
import { Dashboard } from './pages/Dashboard'
import { RoleWorkspace } from './pages/RoleWorkspace'
import type { RoleId, User } from './types'
import './styles.css'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })

function App() {
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: api.users })
  const rolesQuery = useQuery({ queryKey: ['roles'], queryFn: api.roles })
  const associatesQuery = useQuery({ queryKey: ['associates'], queryFn: api.associates })
  const [role, setRole] = useState<RoleId>('EARLY_TALENT')
  const user = useMemo<User>(() => usersQuery.data?.find((candidate) => candidate.role === role) || usersQuery.data?.[0] || { id: 'loading', name: 'ASCEND User', email: '', role, title: '', avatar_initials: 'A' }, [role, usersQuery.data])
  const dashboardAssociateId = role === 'EARLY_TALENT' ? (associatesQuery.data?.find((a) => a.user_id === user.id)?.id || 'as-ananya') : 'as-ananya'
  const dashboardQuery = useQuery({ queryKey: ['dashboard', dashboardAssociateId], queryFn: () => api.dashboard(dashboardAssociateId), enabled: Boolean(usersQuery.data && associatesQuery.data) })

  if (usersQuery.isError || associatesQuery.isError || rolesQuery.isError) return <ErrorScreen />
  return <AppShell role={role} user={user} onRoleChange={setRole}><Routes><Route path="/" element={role === 'EARLY_TALENT' ? <Dashboard data={dashboardQuery.data} isLoading={dashboardQuery.isLoading} /> : <RoleWorkspace role={role} associates={associatesQuery.data || []} />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>
}

function ErrorScreen() { return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="max-w-sm text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">!</div><h1 className="mt-4 text-lg font-bold text-slate-900">ASCEND service unavailable</h1><p className="mt-2 text-sm leading-6 text-slate-500">We couldn’t load the workspace data. Please check that the application services are running and try again.</p></div></div> }

createRoot(document.getElementById('root')!).render(<StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><App /></BrowserRouter></QueryClientProvider></StrictMode>)
