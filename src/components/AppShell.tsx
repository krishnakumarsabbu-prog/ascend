import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Brain, BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Code as Code2, Coins, GitBranch, GitMerge, GraduationCap, LayoutDashboard, Menu, Network, Route, Search, Settings2, ShieldCheck, Sparkles, Target, Users, X, Layers, Cpu, CheckSquare, Terminal, Bot, Award, BarChart3, LayoutGrid, FileText, Lock, Activity, Sliders } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { Associate, RoleId, User } from '../types'
import { AICoachDrawer } from './ai/AICoachDrawer'
import { NotificationCenter } from './notifications/NotificationCenter'
import { GlobalCommandPalette } from './common/GlobalCommandPalette'
import { LiveActivityStreamDrawer } from './activity/LiveActivityStreamDrawer'


interface ShellProps {
  children: ReactNode
  role: RoleId
  user: User
  onRoleChange: (role: RoleId) => void
  associates?: Associate[]
  activeAssociateId?: string
  onAssociateChange?: (id: string) => void
}

interface NavItem { label: string; icon: typeof LayoutDashboard; badge?: string; to?: string }

const navByRole: Record<RoleId, { group: string; items: NavItem[] }[]> = {
  EARLY_TALENT: [
    {
      group: 'Early Talent (GDA Associate)',
      items: [
        { label: 'My Dashboard', icon: LayoutDashboard, to: '/' },
        { label: 'My Skills', icon: Brain, badge: 'NEW', to: '/my-skills' },
        { label: 'Talent Marketplace', icon: BriefcaseBusiness, badge: 'GIGS', to: '/talent-marketplace' },
        { label: 'Credentials Wallet', icon: Award, badge: 'VERIFIED', to: '/credentials' },
        { label: 'AI Coach', icon: Sparkles, badge: 'AI', to: '/ai-coach' },
        { label: 'Integrated Curriculum', icon: BookOpen, to: '/curriculum' },
        { label: 'Pathway Selection', icon: Route, to: '/pathways' },
        { label: 'Commissioning Path', icon: GitBranch, to: '/commissioning' },
        { label: 'Program Overview', icon: GraduationCap, to: '/program-overview' },
      ],
    },
    {
      group: 'HackerRank IDE & Coding',
      items: [
        { label: 'Practice Challenges', icon: Code2, badge: 'NEW', to: '/challenges' },
        { label: 'Live Split-Pane IDE', icon: Terminal, to: '/coding/cc-101' },
      ],
    },
    {
      group: 'Assessments & Milestones',
      items: [
        { label: 'Adaptive CAT Exam', icon: Brain, badge: 'CAT', to: '/adaptive-assessment' },
        { label: 'ASM Lifecycle & Defense', icon: GitBranch, badge: 'REQ 20', to: '/asm-lifecycle' },
        { label: 'WF Course Assessments', icon: ClipboardCheck, to: '/wf-assessments' },
        { label: 'Take Assessment', icon: Target, to: '/take-assessment' },
        { label: 'ASM Milestones', icon: GitBranch, to: '/asm' },
        { label: 'ASM Fork & Environment', icon: Code2, to: '/asm-fork' },
        { label: 'Advanced Intensives', icon: Sparkles, to: '/advanced-intensives' },
        { label: 'Architect Board', icon: Network, to: '/architect-board' },
        { label: 'Credit Ledger', icon: Coins, to: '/credit-ledger' },
      ],
    },
  ],

  MENTOR_COACH: [
    {
      group: 'Mentor / Coach',
      items: [
        { label: 'My Mentees', icon: Users, badge: '2', to: '/mentor' },
        { label: 'AI Mentor Assistant', icon: Sparkles, badge: 'AI', to: '/mentor?view=ai-assistant' },
        { label: 'Mentee Requests', icon: Bell, badge: '2', to: '/mentor?view=requests' },
        { label: 'Development Plan', icon: ClipboardCheck, to: '/mentor?view=plan' },
        { label: 'Pathway Recommendations', icon: Route, to: '/mentor?view=pathways' },
        { label: 'Cohort Performance', icon: BarChart3, to: '/mentor?view=cohort' },
        { label: 'Assessment Oversight', icon: Target, to: '/mentor?view=assessments' },
        { label: 'ASM Milestone Reviews', icon: GitBranch, to: '/mentor?view=asm' },
        { label: 'Credit Approvals', icon: Coins, to: '/mentor?view=credits' },
      ],
    },
  ],
  ENGINEERING_EXCELLENCE_COMMITTEE: [
    {
      group: 'Engineering Excellence',
      items: [
        { label: 'Executive Analytics', icon: BarChart3, badge: 'REQ 24', to: '/analytics' },
        { label: 'Scheduled Reports', icon: FileText, to: '/reports' },
        { label: 'Quality Governance', icon: ShieldCheck, to: '/committee' },
        { label: 'Curriculum & Item Health', icon: BookOpen, to: '/committee?view=items' },
        { label: 'Architect Board Reviews', icon: Network, to: '/committee?view=architect' },
        { label: 'Ledger Audit', icon: Coins, to: '/committee?view=ledger' },
      ],
    },
    {
      group: 'Administration & Studios',
      items: [
        { label: 'System Control Center', icon: Sliders, badge: 'REQ 35', to: '/admin/control-center' },
        { label: 'Integrations Hub', icon: Layers, badge: 'REQ 31', to: '/admin/integrations' },
        { label: 'Metric Lineage', icon: Network, badge: 'REQ 27', to: '/admin/metric-lineage' },
        { label: 'Audit Center', icon: Lock, badge: 'REQ 28', to: '/admin/audit-center' },
        { label: 'Curriculum Branches', icon: GitBranch, badge: 'REQ 30', to: '/admin/curriculum-versions' },
        { label: 'Dashboard Builder', icon: LayoutGrid, badge: 'NEW', to: '/admin/dashboard-builder' },
        { label: 'User Directory', icon: Users, to: '/admin/users' },
        { label: 'Workflow Designer', icon: GitMerge, badge: 'NEW', to: '/admin/workflows' },
        { label: 'Question Governance', icon: BookOpen, badge: 'NEW', to: '/admin/question-governance' },
        { label: 'Course Studio', icon: BookOpen, to: '/admin/courses' },
        { label: 'Question & Problem Studio', icon: Terminal, badge: 'NEW', to: '/admin/questions' },
      ],
    },
  ],
  SENIOR_LEADER_SPONSOR: [
    {
      group: 'Senior Leader Sponsor',
      items: [
        { label: 'Executive Analytics', icon: BarChart3, badge: 'REQ 24', to: '/analytics' },
        { label: 'Demand & Pipeline', icon: BriefcaseBusiness, to: '/sponsor' },
        { label: 'Workforce Simulator', icon: Users, badge: 'SIM', to: '/workforce-planning' },
        { label: 'Scheduled Reports', icon: FileText, to: '/reports' },
        { label: 'AI Executive Intel', icon: Sparkles, badge: 'AI', to: '/sponsor?view=ai-intel' },
        { label: 'Dynamic Difficulty Engine', icon: Target, to: '/sponsor?view=difficulty' },
        { label: 'Sponsored ASM Milestones', icon: GitBranch, to: '/sponsor?view=sponsored' },
        { label: 'Approvals & SLAs', icon: ShieldCheck, badge: 'SLA', to: '/approvals' },
        { label: 'Architect Board Panel', icon: Network, to: '/sponsor?view=architect' },
      ],
    },
    {
      group: 'Administration & Studios',
      items: [
        { label: 'System Control Center', icon: Sliders, badge: 'REQ 35', to: '/admin/control-center' },
        { label: 'Integrations Hub', icon: Layers, badge: 'REQ 31', to: '/admin/integrations' },
        { label: 'Metric Lineage', icon: Network, badge: 'REQ 27', to: '/admin/metric-lineage' },
        { label: 'Audit Center', icon: Lock, badge: 'REQ 28', to: '/admin/audit-center' },
        { label: 'Curriculum Branches', icon: GitBranch, badge: 'REQ 30', to: '/admin/curriculum-versions' },
        { label: 'Dashboard Builder', icon: LayoutGrid, badge: 'NEW', to: '/admin/dashboard-builder' },
        { label: 'Workflow Designer', icon: GitMerge, badge: 'NEW', to: '/admin/workflows' },
        { label: 'Question Governance', icon: BookOpen, badge: 'NEW', to: '/admin/question-governance' },
        { label: 'User Directory', icon: Users, to: '/admin/users' },
        { label: 'Course Studio', icon: BookOpen, to: '/admin/courses' },
        { label: 'Question & Problem Studio', icon: Terminal, to: '/admin/questions' },
      ],
    },
  ],
  TECHNOLOGY_HEAD: [
    {
      group: 'Technology Head',
      items: [
        { label: 'Executive Analytics', icon: BarChart3, badge: 'REQ 24', to: '/analytics' },
        { label: 'Cloud & Platform Readiness', icon: LayoutDashboard, to: '/techhead' },
        { label: 'Workforce Simulator', icon: Users, badge: 'SIM', to: '/workforce-planning' },
        { label: 'Scheduled Reports', icon: FileText, to: '/reports' },
        { label: 'AI Executive Intel', icon: Sparkles, badge: 'AI', to: '/techhead?view=ai-intel' },
        { label: 'Approvals & SLAs', icon: ShieldCheck, badge: 'SLA', to: '/approvals' },
        { label: 'Stack Coverage', icon: Cpu, to: '/techhead?view=stack' },
        { label: 'ASM Pipeline', icon: GitBranch, to: '/techhead?view=pipeline' },
        { label: 'Commissioning Sign-off', icon: ShieldCheck, to: '/techhead?view=signoff' },
      ],
    },
    {
      group: 'Administration & Studios',
      items: [
        { label: 'System Control Center', icon: Sliders, badge: 'REQ 35', to: '/admin/control-center' },
        { label: 'Integrations Hub', icon: Layers, badge: 'REQ 31', to: '/admin/integrations' },
        { label: 'Metric Lineage', icon: Network, badge: 'REQ 27', to: '/admin/metric-lineage' },
        { label: 'Audit Center', icon: Lock, badge: 'REQ 28', to: '/admin/audit-center' },
        { label: 'Curriculum Branches', icon: GitBranch, badge: 'REQ 30', to: '/admin/curriculum-versions' },
        { label: 'Dashboard Builder', icon: LayoutGrid, badge: 'NEW', to: '/admin/dashboard-builder' },
        { label: 'Workflow Designer', icon: GitMerge, badge: 'NEW', to: '/admin/workflows' },
        { label: 'Question Governance', icon: BookOpen, badge: 'NEW', to: '/admin/question-governance' },
        { label: 'User Directory', icon: Users, to: '/admin/users' },
        { label: 'Course Studio', icon: BookOpen, to: '/admin/courses' },
        { label: 'Question & Problem Studio', icon: Terminal, to: '/admin/questions' },
      ],
    },
  ],

}

const roleLabels: Record<RoleId, string> = {
  EARLY_TALENT: 'Early Talent (GDA Associate)',
  MENTOR_COACH: 'Mentor / Coach',
  ENGINEERING_EXCELLENCE_COMMITTEE: 'Engineering Excellence Committee',
  SENIOR_LEADER_SPONSOR: 'Senior Leader Sponsor',
  TECHNOLOGY_HEAD: 'Technology Head',
}

export function AppShell({ children, role, user, onRoleChange, associates = [], activeAssociateId, onAssociateChange }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [assocOpen, setAssocOpen] = useState(false)
  const [isAICoachOpen, setIsAICoachOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false)
  const groups = navByRole[role]
  const location = useLocation()

  const currentAssociate = associates.find((a) => a.id === activeAssociateId) || associates[0]

  return (
    <div className="min-h-screen bg-[#fcfcfb] text-slate-900 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col bg-[#0c1b33] text-slate-300 transition-all duration-300 ${collapsed ? 'lg:w-[76px]' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-[72px] items-center border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-amber-200">
              <span className="text-sm font-serif font-bold">A</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-serif tracking-[0.14em] font-bold text-white">ASCEND</p>
                <p className="text-[8px] font-semibold tracking-[0.12em] text-slate-400">GRADUATE DEVELOPER ACCELERATOR · WELLS FARGO</p>
              </div>
            )}
          </div>
          <button className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={17} />
          </button>
        </div>

        {/* Role Selector */}
        <div className={`border-b border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="relative">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">Viewing as</p>
            <button
              onClick={() => { setRoleOpen(!roleOpen); setAssocOpen(false) }}
              className={`flex w-full items-center gap-2 rounded-md border border-white/15 bg-[#172b4c] p-2.5 text-left transition-colors hover:bg-white/10 ${collapsed ? 'justify-center border-0 p-1' : ''}`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/20 text-[10px] font-bold text-blue-200">
                {user.avatar_initials}
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{roleLabels[role]}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
            {roleOpen && !collapsed && (
              <RoleMenu role={role} onRoleChange={(next) => { onRoleChange(next); setRoleOpen(false) }} />
            )}
          </div>

          {/* Associate Selector (When in Early Talent mode) */}
          {role === 'EARLY_TALENT' && !collapsed && associates.length > 0 && (
            <div className="relative mt-2.5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">GDA Associate</p>
              <button
                onClick={() => { setAssocOpen(!assocOpen); setRoleOpen(false) }}
                className="flex w-full items-center gap-2 rounded-md border border-white/15 bg-[#172b4c] p-2 text-left transition-colors hover:bg-white/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{currentAssociate?.name} — {currentAssociate?.standing === 'FAST_TRACK' ? 'Fast-Track' : 'On Track'}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${assocOpen ? 'rotate-180' : ''}`} />
              </button>
              {assocOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-white/15 bg-[#132846] p-1.5 shadow-xl">
                  {associates.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { onAssociateChange?.(a.id); setAssocOpen(false) }}
                      className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${a.id === activeAssociateId ? 'bg-blue-500/25 font-bold text-blue-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      {a.name} — {a.standing === 'FAST_TRACK' ? 'Fast-Track' : 'On Track'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.group}>
                <p className={`mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 ${collapsed ? 'text-center' : ''}`}>
                  {collapsed ? '•••' : group.group}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = item.to ? (
                      item.to.includes('?') ? location.pathname + location.search === item.to : location.pathname === item.to
                    ) : false

                    const content = (
                      <>
                        <item.icon size={15} className="shrink-0" strokeWidth={1.8} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded bg-blue-400/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-200">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )

                    const className = `group flex w-full items-center gap-3 rounded-md px-2.5 py-1.5 text-left text-[12.5px] font-medium transition-all ${
                      isActive ? 'bg-[#1e3a66] text-white font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    } ${collapsed ? 'justify-center px-0' : ''}`

                    return item.to ? (
                      <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={className} title={collapsed ? item.label : undefined}>
                        {content}
                      </Link>
                    ) : (
                      <button key={item.label} onClick={() => setMobileOpen(false)} className={className} title={collapsed ? item.label : undefined}>
                        {content}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {!collapsed && <span>ASCEND Framework UI v2.0</span>}
          </div>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[82px] hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900 lg:flex">
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main className={`transition-all duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[268px]'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-8">
          <button className="mr-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">ASCEND</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{roleLabels[role]}</span>
          </div>

          {/* Global Quick Search Button (Req 33) */}
          <div className="hidden md:flex items-center ml-6">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-200/80 px-3 py-1.5 text-xs text-slate-500 transition shadow-inner"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search size={14} className="text-slate-400" />
              <span>Search ASCEND...</span>
              <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 md:gap-5">
            {/* Live Activity Stream & Presence Trigger (Req 34) */}
            <button
              onClick={() => setIsStreamDrawerOpen(true)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Live Telemetry & Presence Stream"
            >
              <Activity size={18} />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <NotificationCenter />
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/80 py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c1b33] text-[10px] font-bold text-white">
                {role === 'EARLY_TALENT' ? currentAssociate?.name.split(' ').map(n => n[0]).join('') : user.avatar_initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-tight text-slate-800">
                  {role === 'EARLY_TALENT' ? currentAssociate?.name : user.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {role === 'EARLY_TALENT' ? `GDA Cohort 2025 · ${currentAssociate?.standing === 'FAST_TRACK' ? 'Fast-Track' : 'On Track'}` : user.title}
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition-colors"
            >
              Switch Persona / Sign Out
            </Link>
          </div>
        </header>


        {/* Header Profile Strip (Matching Screenshot Style) */}
        <div className="mx-auto max-w-[1600px] px-4 pt-6 md:px-8">
          <div className="rounded-xl border border-slate-200/90 bg-[#f9f9f6] p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white shadow-sm">
                {role === 'EARLY_TALENT' ? 'AR' : role === 'MENTOR_COACH' ? 'PN' : role === 'ENGINEERING_EXCELLENCE_COMMITTEE' ? 'EE' : role === 'SENIOR_LEADER_SPONSOR' ? 'SL' : 'TH'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-300/70 bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    {role === 'EARLY_TALENT' ? 'GDA ASSOCIATE' : role === 'MENTOR_COACH' ? 'MENTOR / COACH — PRIYA NAIR' : role === 'ENGINEERING_EXCELLENCE_COMMITTEE' ? 'ENGINEERING EXCELLENCE COMMITTEE' : role === 'SENIOR_LEADER_SPONSOR' ? 'SENIOR LEADER SPONSOR' : 'TECHNOLOGY HEAD'}
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {role === 'EARLY_TALENT' ? currentAssociate?.name : role === 'MENTOR_COACH' ? 'Priya Nair' : role === 'ENGINEERING_EXCELLENCE_COMMITTEE' ? 'Engineering Excellence Committee' : role === 'SENIOR_LEADER_SPONSOR' ? 'Senior Leader Sponsor' : 'Technology Head'}
                </h2>
                <p className="text-xs text-slate-500">
                  {role === 'EARLY_TALENT'
                    ? `GDA Cohort 2025 · ${currentAssociate?.team_name} · ${currentAssociate?.standing === 'FAST_TRACK' ? 'Fast-Track' : 'On Track'}`
                    : role === 'MENTOR_COACH'
                    ? 'GDA mentor pod — 2 active mentees, 2 pending requests'
                    : role === 'ENGINEERING_EXCELLENCE_COMMITTEE'
                    ? 'Owns the GDA assessment framework, ASM library, waiver approvals & difficulty calibration'
                    : role === 'SENIOR_LEADER_SPONSOR'
                    ? 'Demand-side view across engineering teams, sponsors live-problem ASM milestones'
                    : 'Owns the D2/D3 readiness bar and final technology sign-off before commissioning'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] p-4 md:p-8">
          {children}
        </div>

        {/* Global Floating AI Coach Trigger Button */}
        <button
          onClick={() => setIsAICoachOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-indigo-400/30 group"
          title="Open ASCEND AI Coach"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask AI Coach</span>
        </button>

        {/* Global AI Coach Drawer */}
        <AICoachDrawer
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          associateId={activeAssociateId || 'as-ananya'}
        />

        {/* Global Quick-Action Command Palette (Req 33) */}
        <GlobalCommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
        />

        {/* Real-Time Global Activity Stream & Presence Drawer (Req 34) */}
        <LiveActivityStreamDrawer
          isOpen={isStreamDrawerOpen}
          onClose={() => setIsStreamDrawerOpen(false)}
        />
      </main>
    </div>
  )
}

function RoleMenu({ role, onRoleChange }: { role: RoleId; onRoleChange: (role: RoleId) => void }) {
  const options: RoleId[] = ['EARLY_TALENT', 'MENTOR_COACH', 'ENGINEERING_EXCELLENCE_COMMITTEE', 'SENIOR_LEADER_SPONSOR', 'TECHNOLOGY_HEAD']
  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 top-full z-50 mt-1 w-full space-y-0.5 rounded-md border border-white/15 bg-[#132846] p-1.5 shadow-2xl">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onRoleChange(option)}
          className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
            option === role ? 'bg-blue-500/25 font-bold text-blue-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          {roleLabels[option]}
        </button>
      ))}
    </motion.div>
  )
}
