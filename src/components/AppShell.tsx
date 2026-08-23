import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Code as Code2, Coins, GitBranch, GraduationCap, LayoutDashboard, Menu, Network, PanelLeft, Route, Search, Settings2, ShieldCheck, Sparkles, Target, Users, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { RoleId, User } from '../types'
import { Button } from './ui'

interface ShellProps { children: ReactNode; role: RoleId; user: User; onRoleChange: (role: RoleId) => void }
interface NavItem { label: string; icon: typeof LayoutDashboard; badge?: string; to?: string }

const navByRole: Record<RoleId, { group: string; items: NavItem[] }[]> = {
  EARLY_TALENT: [
    { group: 'Workspace', items: [{ label: 'My Dashboard', icon: LayoutDashboard, to: '/' }, { label: 'Integrated Curriculum', icon: BookOpen, badge: '7', to: '/curriculum' }, { label: 'Pathway Selection', icon: Route, to: '/pathways' }, { label: 'Program Overview', icon: GraduationCap }] },
    { group: 'Engineering Journey', items: [{ label: 'WF Course Assessments', icon: ClipboardCheck, to: '/curriculum' }, { label: 'Take Assessment', icon: Target, to: '/curriculum' }, { label: 'ASM Milestones', icon: GitBranch }, { label: 'ASM Fork & Environment', icon: Code2 }, { label: 'Advanced Intensives', icon: Sparkles }, { label: 'Architect Board', icon: Network }] },
    { group: 'Recognition', items: [{ label: 'Credit Ledger', icon: Coins }] },
  ],
  MENTOR_COACH: [
    { group: 'Workspace', items: [{ label: 'My Mentees', icon: Users, badge: '4' }, { label: 'Mentee Requests', icon: Bell, badge: '2' }, { label: 'Development Plan', icon: ClipboardCheck }] },
    { group: 'Guidance', items: [{ label: 'Pathway Panel', icon: Route, to: '/pathways' }, { label: 'Waiver Recommendations', icon: ShieldCheck }, { label: 'Architect Board Panel', icon: Network }] },
  ],
  ENGINEERING_EXCELLENCE_COMMITTEE: [
    { group: 'Governance', items: [{ label: 'Cohort Overview', icon: Users }, { label: 'Pathway Panel', icon: Route, to: '/pathways' }, { label: 'Assessment Setup', icon: Settings2 }] },
    { group: 'Standards', items: [{ label: 'Question Bank', icon: BookOpen }, { label: 'ASM Library', icon: GitBranch }, { label: 'Waiver Requests', icon: ShieldCheck }, { label: 'Difficulty Engine', icon: Target }, { label: 'Ledger Audit', icon: Coins }] },
  ],
  SENIOR_LEADER_SPONSOR: [
    { group: 'Portfolio', items: [{ label: 'Demand & Pipeline', icon: BriefcaseBusiness }, { label: 'Sponsored ASM Milestones', icon: GitBranch }] },
    { group: 'Decisions', items: [{ label: 'Approvals', icon: ShieldCheck }, { label: 'Architect Board Panel', icon: Network }] },
  ],
}

const roleLabels: Record<RoleId, string> = { EARLY_TALENT: 'Early Talent', MENTOR_COACH: 'Mentor Coach', ENGINEERING_EXCELLENCE_COMMITTEE: 'Excellence Committee', SENIOR_LEADER_SPONSOR: 'Senior Leader Sponsor' }

export function AppShell({ children, role, user, onRoleChange }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const groups = navByRole[role]
  const location = useLocation()

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#0c1b33] text-slate-300 transition-all duration-300 ${collapsed ? 'lg:w-[76px]' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <div className="flex min-w-0 items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/25"><span className="text-sm font-black">A</span></div>{!collapsed && <div className="min-w-0"><p className="truncate text-[15px] font-bold tracking-[0.16em] text-white">ASCEND</p><p className="text-[9px] font-semibold tracking-[0.18em] text-slate-500">GRADUATE DEVELOPER ACCELERATOR</p></div>}</div>
        <button className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)}><X size={17} /></button>
      </div>
      <div className={`border-b border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}><button onClick={() => setRoleOpen(!roleOpen)} className={`flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2.5 text-left transition-colors hover:bg-white/10 ${collapsed ? 'justify-center border-0 p-1' : ''}`}><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400/15 text-[10px] font-bold text-blue-300">{user.avatar_initials}</div>{!collapsed && <><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">Viewing as</p><p className="truncate text-[11px] text-slate-400">{roleLabels[role]}</p></div><ChevronDown size={14} className={`text-slate-500 transition-transform ${roleOpen ? 'rotate-180' : ''}`} /></>}</button>{roleOpen && !collapsed && <RoleMenu role={role} onRoleChange={(next) => { onRoleChange(next); setRoleOpen(false) }} />}</div>
      <nav className="flex-1 overflow-y-auto px-3 py-5"><div className="space-y-6">{groups.map((group) => <div key={group.group}><p className={`mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 ${collapsed ? 'text-center' : ''}`}>{collapsed ? '•••' : group.group}</p><div className="space-y-1">{group.items.map((item) => { const isActive = item.to ? (item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)) : false; const content = <><item.icon size={16} className="shrink-0" strokeWidth={1.8} />{!collapsed && <><span className="flex-1 truncate">{item.label}</span>{item.badge && <span className="rounded bg-blue-400/15 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">{item.badge}</span>}</>}</>; const className = `group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-all ${isActive ? 'bg-blue-500/15 text-blue-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${collapsed ? 'justify-center px-0' : ''}`; return item.to ? <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={className} title={collapsed ? item.label : undefined}>{content}</Link> : <button key={item.label} onClick={() => setMobileOpen(false)} className={className} title={collapsed ? item.label : undefined}>{content}</button> })}</div></div>)}</div></nav>
      <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}><button className="flex items-center gap-3 rounded-md px-2.5 py-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white" title="Help & support"><CircleHelp size={16} />{!collapsed && <span className="text-xs font-medium">Help & support</span>}</button></div>
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[82px] hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900 lg:flex">{collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}</button>
    </aside>
    {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
    <main className={`transition-all duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'}`}>
      <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8"><button className="mr-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="hidden items-center gap-2 text-xs text-slate-400 md:flex"><span>ASCEND</span><span className="text-slate-300">/</span><span className="font-medium text-slate-700">Workspace</span></div><div className="ml-auto flex items-center gap-2 md:gap-4"><button className="hidden rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:block"><Search size={18} /></button><button className="relative rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Bell size={18} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white" /></button><div className="h-6 w-px bg-slate-200" /><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c1b33] text-[10px] font-bold text-white">{user.avatar_initials}</div><div className="hidden text-left sm:block"><p className="text-xs font-semibold text-slate-800">{user.name}</p><p className="text-[10px] text-slate-400">{user.title}</p></div><ChevronDown size={14} className="hidden text-slate-400 sm:block" /></div></div></header>
      <div className="mx-auto max-w-[1600px] p-4 md:p-8">{children}</div>
    </main>
  </div>
}

function RoleMenu({ role, onRoleChange }: { role: RoleId; onRoleChange: (role: RoleId) => void }) {
  const options: RoleId[] = ['EARLY_TALENT', 'MENTOR_COACH', 'ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR']
  return <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1 rounded-md border border-white/10 bg-[#132846] p-1.5 shadow-xl">{options.map((option) => <button key={option} onClick={() => onRoleChange(option)} className={`w-full rounded px-2 py-2 text-left text-[11px] transition-colors ${option === role ? 'bg-blue-500/15 text-blue-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{roleLabels[option]}</button>)}</motion.div>
}
