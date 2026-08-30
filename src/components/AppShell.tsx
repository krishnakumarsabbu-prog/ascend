import { useState, type ReactNode } from 'react'
import {
  Bell,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Code as Code2,
  Coins,
  GitBranch,
  LayoutDashboard,
  Menu,
  Network,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Cpu,
  Terminal,
  Bot,
  Award,
  BarChart3,
  FileText,
  Activity,
  Sliders,
  LogOut,
  Zap,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { Associate, RoleId, User } from '../types'
import { AICoachDrawer } from './ai/AICoachDrawer'
import { NotificationCenter } from './notifications/NotificationCenter'
import { GlobalCommandPalette } from './common/GlobalCommandPalette'
import { LiveActivityStreamDrawer } from './activity/LiveActivityStreamDrawer'
import { useAuth } from '../context/AuthContext'

interface ShellProps {
  children: ReactNode
  role: RoleId
  user: User
  associates?: Associate[]
  activeAssociateId?: string
}

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  badge?: string
  to?: string
}

const navByRole: Record<RoleId, { group: string; items: NavItem[] }[]> = {
  EARLY_TALENT: [
    {
      group: 'Core Learning',
      items: [
        { label: 'My Dashboard', icon: LayoutDashboard, to: '/' },
        { label: 'Study Curriculum', icon: BookOpen, to: '/curriculum' },
        { label: 'Course Assessments', icon: ClipboardCheck, to: '/take-assessment' },
        { label: 'Adaptive CAT Exam', icon: Brain, badge: 'CAT', to: '/adaptive-assessment' },
      ],
    },
    {
      group: 'Practice & Engineering',
      items: [
        { label: 'Practice Challenges', icon: Code2, badge: 'IDE', to: '/challenges' },
        { label: 'Live Coding Workspace', icon: Terminal, to: '/coding/cc-101' },
        { label: 'ASM Milestone Journey', icon: GitBranch, badge: '24M', to: '/asm' },
        { label: 'Pathway Specialization', icon: Route, to: '/pathways' },
      ],
    },
    {
      group: 'Skills & Career Growth',
      items: [
        { label: 'My Skills Radar', icon: Target, badge: 'RADAR', to: '/my-skills' },
        { label: 'Credentials Wallet', icon: Award, badge: 'VERIFIED', to: '/credentials' },
        { label: 'Talent Marketplace', icon: BriefcaseBusiness, badge: 'GIGS', to: '/talent-marketplace' },
        { label: 'AI Career Coach', icon: Sparkles, badge: 'AI', to: '/ai-coach' },
      ],
    },
  ],

  MENTOR_COACH: [
    {
      group: 'Mentorship & Coaching',
      items: [
        { label: 'My Mentees Pod', icon: Users, badge: '2', to: '/mentor' },
        { label: '1-on-1 Development Plans', icon: ClipboardCheck, to: '/mentor?view=plan' },
        { label: 'Mentee Help Requests', icon: Bell, badge: '2', to: '/mentor?view=requests' },
        { label: 'AI Mentor Copilot', icon: Sparkles, badge: 'AI', to: '/mentor?view=ai-assistant' },
      ],
    },
    {
      group: 'Evaluation & Approvals',
      items: [
        { label: 'ASM Milestone Reviews', icon: GitBranch, badge: 'REVIEW', to: '/mentor?view=asm' },
        { label: 'Assessment Oversight', icon: Target, to: '/mentor?view=assessments' },
        { label: 'Credit Approvals & SLAs', icon: ShieldCheck, badge: 'SLA', to: '/approvals' },
        { label: 'Pathway Guidance', icon: Route, to: '/mentor?view=pathways' },
      ],
    },
  ],

  ENGINEERING_EXCELLENCE_COMMITTEE: [
    {
      group: 'Program Governance',
      items: [
        { label: 'Governance Dashboard', icon: ShieldCheck, to: '/committee' },
        { label: 'Curriculum & Item Health', icon: BookOpen, to: '/committee?view=items' },
        { label: 'Credit Ledger Audit', icon: Coins, to: '/committee?view=ledger' },
        { label: 'Architect Board Panel', icon: Network, to: '/committee?view=architect' },
      ],
    },
    {
      group: 'Content & Studios',
      items: [
        { label: 'Question & Problem Studio', icon: Terminal, badge: 'AUTHOR', to: '/admin/questions' },
        { label: 'Question Lifecycle', icon: BookOpen, badge: 'QC', to: '/admin/question-governance' },
        { label: 'Course Studio', icon: BookOpen, to: '/admin/courses' },
        { label: 'Curriculum Branches', icon: GitBranch, badge: 'GIT', to: '/admin/curriculum-versions' },
      ],
    },
    {
      group: 'Administration & System',
      items: [
        { label: 'User Directory', icon: Users, to: '/admin/users' },
        { label: 'System Control Center', icon: Sliders, badge: 'SYS', to: '/admin/control-center' },
      ],
    },
  ],

  SENIOR_LEADER_SPONSOR: [
    {
      group: 'Executive Sponsorship',
      items: [
        { label: 'Demand & Pipeline Portal', icon: BriefcaseBusiness, to: '/sponsor' },
        { label: 'Executive Analytics', icon: BarChart3, badge: 'KPI', to: '/analytics' },
        { label: 'AI Executive Intel', icon: Sparkles, badge: 'AI', to: '/sponsor?view=ai-intel' },
        { label: 'Scheduled Reports', icon: FileText, to: '/reports' },
      ],
    },
    {
      group: 'Workforce & Decisions',
      items: [
        { label: 'Workforce Simulator', icon: Users, badge: 'SIM', to: '/workforce-planning' },
        { label: 'Approvals & SLAs', icon: ShieldCheck, badge: 'SLA', to: '/approvals' },
        { label: 'Sponsored ASM Milestones', icon: GitBranch, to: '/sponsor?view=sponsored' },
      ],
    },
  ],

  TECHNOLOGY_HEAD: [
    {
      group: 'Enterprise Tech Readiness',
      items: [
        { label: 'Platform Readiness Portal', icon: LayoutDashboard, to: '/techhead' },
        { label: 'Tech Stack Proficiency', icon: Cpu, badge: 'RADAR', to: '/techhead?view=stack' },
        { label: 'Commissioning Sign-off', icon: ShieldCheck, badge: 'GATE 3', to: '/techhead?view=signoff' },
        { label: 'Executive Analytics', icon: BarChart3, badge: 'KPI', to: '/analytics' },
      ],
    },
    {
      group: 'Leadership Oversight',
      items: [
        { label: 'Workforce Strategy', icon: Users, badge: 'SIM', to: '/workforce-planning' },
        { label: 'Executive Approvals & SLAs', icon: ShieldCheck, badge: 'SLA', to: '/approvals' },
        { label: 'AI Executive Intel', icon: Sparkles, badge: 'AI', to: '/techhead?view=ai-intel' },
        { label: 'Scheduled Reports', icon: FileText, to: '/reports' },
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

export function AppShell({
  children,
  role,
  user,
  associates = [],
  activeAssociateId,
}: ShellProps) {
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAICoachOpen, setIsAICoachOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false)
  const groups = navByRole[role] || navByRole.EARLY_TALENT
  const location = useLocation()
  const navigate = useNavigate()

  // Match the user's specific associate profile for Early Talent
  const currentAssociate =
    associates.find((a) => a.id === activeAssociateId || a.user_id === user.id) || associates[0]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user.name
  const displayInitials = user.avatar_initials || user.name.split(' ').map((n) => n[0]).join('')

  const displaySubtitle =
    role === 'EARLY_TALENT'
      ? `GDA Cohort 2025 · ${user.team || currentAssociate?.team_name || 'Payments Platform'} · ${
          currentAssociate?.standing === 'FAST_TRACK' ? 'Fast-Track Trajectory' : 'On-Track Trajectory'
        }`
      : role === 'MENTOR_COACH'
      ? `${user.title} · ${user.team || 'Payments Platform'} · 2 Active Mentees`
      : role === 'ENGINEERING_EXCELLENCE_COMMITTEE'
      ? 'Program & Item Governance · Question Studios · 500+ Items Bank'
      : role === 'SENIOR_LEADER_SPONSOR'
      ? `${user.title} · ${user.team || 'Platform Group'} · Dual-Bar Pipeline`
      : 'Enterprise Platform Readiness Bar · D1/D2/D3 Matrix · Commissioning Sign-Off'

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation (Harness Dark Theme) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col bg-[#0b1324] text-slate-300 border-r border-slate-800/80 transition-all duration-200 ${
          collapsed ? 'lg:w-[72px]' : ''
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Logo & Platform Title */}
        <div className="flex h-[64px] items-center border-b border-slate-800/80 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00ADEF] via-[#0084FF] to-[#6366f1] font-black text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Zap size={18} fill="currentColor" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[15px] font-black tracking-tight text-white">ASCEND</p>
                  <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[8.5px] font-black tracking-wider text-sky-400 border border-sky-500/30">
                    ENTERPRISE
                  </span>
                </div>
                <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                  TALENT ACCELERATOR
                </p>
              </div>
            )}
          </Link>
          <button
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Current Authenticated User Context Card */}
        <div className={`p-3 border-b border-slate-800/80 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="rounded-xl bg-[#111c33] p-2.5 border border-slate-800/90 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {displayInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-sky-400 truncate">
                    {roleLabels[role].split(' ')[0]}
                  </span>
                </div>
                <p className="truncate text-xs font-bold text-white leading-tight">{displayName}</p>
                <p className="truncate text-[10px] text-slate-400">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.group}>
                <p
                  className={`mb-1.5 px-2.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400 ${
                    collapsed ? 'text-center' : ''
                  }`}
                >
                  {collapsed ? '•••' : group.group}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = item.to
                      ? item.to.includes('?')
                        ? location.pathname + location.search === item.to
                        : location.pathname === item.to
                      : false

                    const content = (
                      <>
                        <item.icon
                          size={15}
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                          strokeWidth={isActive ? 2.2 : 1.8}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${
                                  item.badge === 'CAT' || item.badge === 'CAPSTONE'
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                                    : item.badge === 'AI'
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
                                    : item.badge === 'CODE' || item.badge === 'RADAR'
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                                    : 'bg-sky-500/15 text-sky-300 border border-sky-500/25'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )

                    const className = `group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#152340] text-white font-semibold shadow-xs border-l-2 border-sky-400 pl-[8px]'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    } ${collapsed ? 'justify-center px-0 border-l-0' : ''}`

                    return item.to ? (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={className}
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        onClick={() => setMobileOpen(false)}
                        className={className}
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer with Sign Out */}
        <div className={`border-t border-slate-800/80 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-400">ASCEND v2.0</span>
              <button
                onClick={handleLogout}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[74px] hidden h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm hover:text-slate-900 lg:flex"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className={`transition-all duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[268px]'}`}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-[64px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md md:px-8">
          <button
            className="mr-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-900 tracking-tight">ASCEND</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="font-medium text-slate-600">{roleLabels[role]}</span>
          </div>

          {/* Global Quick Search (Ctrl+K) */}
          <div className="hidden md:flex items-center ml-6">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-xs text-slate-500 transition shadow-2xs"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search size={13} className="text-slate-400" />
              <span>Search modules, questions, challenges...</span>
              <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.2 text-[9.5px] font-mono font-bold text-slate-500">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Live Activity Stream */}
            <button
              onClick={() => setIsStreamDrawerOpen(true)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Live Telemetry & Activity Stream"
            >
              <Activity size={17} />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <NotificationCenter />
            <div className="h-5 w-px bg-slate-200" />

            {/* Authenticated User Badge */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200/90 bg-slate-50/80 py-1 pl-1.5 pr-3 shadow-2xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0b1324] text-[10px] font-bold text-white">
                {displayInitials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-tight text-slate-800">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user.title.split('(')[0]}</p>
              </div>
            </div>

            {/* Real Sign Out Action */}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 px-2.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              title="Log out of current session"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Profile & Context Header Strip (Harness Theme) */}
        <div className="mx-auto max-w-[1600px] px-4 pt-5 md:px-8">
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 md:p-5 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0b1324] via-[#16274a] to-[#0284c7] text-base font-bold text-white shadow-sm">
                {displayInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                    {roleLabels[role]}
                  </span>
                  {role === 'EARLY_TALENT' && currentAssociate?.standing === 'FAST_TRACK' && (
                    <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      ⚡ Fast-Track Trajectory
                    </span>
                  )}
                  {role === 'EARLY_TALENT' && (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Active Cohort 2025-A
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">{displayName}</h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{displaySubtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content Container */}
        <div className="mx-auto max-w-[1600px] p-4 md:p-8">{children}</div>

        {/* Floating AI Coach Trigger */}
        <button
          onClick={() => setIsAICoachOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-sky-400/30 group"
          title="Open ASCEND AI Coach"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">AI Coach</span>
        </button>

        {/* Global AI Coach Drawer */}
        <AICoachDrawer
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          associateId={activeAssociateId || 'as-ananya'}
        />

        {/* Global Quick-Action Command Palette */}
        <GlobalCommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

        {/* Real-Time Activity Stream */}
        <LiveActivityStreamDrawer
          isOpen={isStreamDrawerOpen}
          onClose={() => setIsStreamDrawerOpen(false)}
        />
      </main>
    </div>
  )
}
