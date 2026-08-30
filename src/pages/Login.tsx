import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Users,
  Briefcase,
  Award,
  Network,
  ArrowRight,
  Lock,
  Mail,
  GraduationCap,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import { useAuth, ENTERPRISE_USERS } from '../context/AuthContext'
import { Button, Card } from '../components/ui'

interface AccountCard {
  key: string
  name: string
  title: string
  email: string
  roleLabel: string
  badge: string
  description: string
  icon: React.ElementType
  color: string
}

const DIRECTORY_ACCOUNTS: AccountCard[] = [
  {
    key: 'u-ananya',
    name: 'Ananya Rao',
    title: 'Associate Software Engineer (Payments Platform)',
    email: 'ananya.rao@wellsfargo.com',
    roleLabel: 'Early Talent (Intern)',
    badge: 'Cohort 2025 · Fast-Track',
    description: 'Personalized intern curriculum, HackerRank coding challenges, CAT assessments, and ASM capstone defense.',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    key: 'u-rohan',
    name: 'Rohan Mehta',
    title: 'Associate Software Engineer (Data Infrastructure)',
    email: 'rohan.mehta@wellsfargo.com',
    roleLabel: 'Early Talent (Intern)',
    badge: 'Cohort 2025 · On Track',
    description: 'Data engineering track, Kafka streaming milestones, credit tracking, and digital credentials wallet.',
    icon: Sparkles,
    color: 'from-cyan-600 to-blue-700',
  },
  {
    key: 'u-priya',
    name: 'Priya Nair',
    title: 'Lead Systems Architect & Mentor Coach',
    email: 'priya.nair@wellsfargo.com',
    roleLabel: 'Mentor / Coach',
    badge: 'Lead Mentor Pod',
    description: 'Oversees assigned mentees, PR code reviews, 1-on-1 coaching plans, and milestone endorsements.',
    icon: Users,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    key: 'u-committee',
    name: 'Engineering Excellence Committee',
    title: 'Curriculum & Governance Board',
    email: 'engineering.excellence@wellsfargo.com',
    roleLabel: 'Program Governance',
    badge: '500+ Items Bank',
    description: 'Question and course authoring studios, item discrimination analytics, and credit compliance audit.',
    icon: Award,
    color: 'from-purple-600 to-indigo-800',
  },
  {
    key: 'u-sponsor',
    name: 'Senior Leadership Sponsor',
    title: 'Head of Engineering Talent & Sponsoring VP',
    email: 'talent.sponsor@wellsfargo.com',
    roleLabel: 'Executive Sponsor',
    badge: 'Engineering VP',
    description: 'Dual-bar demand vs supply pipeline, workforce planning simulator, and fast-track promotion approvals.',
    icon: Briefcase,
    color: 'from-amber-600 to-orange-700',
  },
  {
    key: 'u-techhead',
    name: 'Technology Head',
    title: 'Chief Technology Officer / Global Head of Tech',
    email: 'technology.head@wellsfargo.com',
    roleLabel: 'Technology Head',
    badge: 'Global Head / CTO',
    description: 'D1/D2/D3 engineering readiness heatmap, tech stack radar, and production commissioning sign-off.',
    icon: Network,
    color: 'from-rose-600 to-pink-800',
  },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your enterprise email address.')
      return
    }
    setIsLoading(true)
    setError(null)
    const success = await login(email, password)
    setIsLoading(false)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid enterprise credentials or user not found in directory.')
    }
  }

  const handleAccountSelect = async (accountKey: string) => {
    setIsLoading(true)
    setError(null)
    const success = await login(accountKey)
    setIsLoading(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071326] via-[#0c1e3d] to-[#12284e] text-slate-100 flex flex-col justify-between p-6">
      {/* Top Brand Nav */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-xl text-white shadow-lg shadow-blue-500/20 border border-white/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">ASCEND</span>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                ENTERPRISE v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Graduate Developer Accelerator &amp; Assessment Suite</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Wells Fargo Enterprise Single Sign-On (SSO)</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full py-8 grid gap-8 lg:grid-cols-[1fr_1.35fr] items-start">
        {/* Left: SSO / Credential Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">SECURE ENTERPRISE ACCESS</span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sign In to Your Workspace
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Enter your corporate email to access your role-specific portal. Role-Based Access Control (RBAC) policies and data isolation are strictly enforced.
            </p>
          </div>

          <Card className="border-slate-800 bg-[#0f244a]/90 backdrop-blur-md p-6 shadow-2xl text-slate-100">
            <form onSubmit={handleCustomLogin} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enterprise Email / Network ID</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya.rao@wellsfargo.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password / Security Token</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                {isLoading ? 'Authenticating...' : 'Sign In with Enterprise SSO'}
                <ArrowRight size={14} />
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <KeyRound size={13} className="text-blue-400" />
                Dual-Factor Hardware Token Enabled
              </span>
              <span>TLS 1.3 Encrypted</span>
            </div>
          </Card>
        </motion.div>

        {/* Right: Quick Enterprise Accounts Directory */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">ENTERPRISE DIRECTORY</span>
              <h2 className="text-base font-bold text-white">Log in as a Specific Enterprise User</h2>
            </div>
            <span className="text-xs text-slate-400">Isolated user session</span>
          </div>

          <div className="grid gap-3">
            {DIRECTORY_ACCOUNTS.map((acc) => {
              const Icon = acc.icon
              return (
                <button
                  key={acc.key}
                  onClick={() => handleAccountSelect(acc.key)}
                  className="group w-full rounded-xl border border-slate-800 bg-[#0c1f40]/80 p-3.5 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-500 hover:bg-[#112a57] hover:shadow-xl hover:shadow-blue-500/10 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${acc.color} text-white shadow-md`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {acc.name}
                        </span>
                        <span className="rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 text-[9.5px] font-semibold">
                          {acc.roleLabel}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[9.5px] font-semibold text-slate-400 border border-slate-700">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{acc.email}</p>
                      <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-1 leading-relaxed">
                        {acc.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>ASCEND Integrated Talent Acceleration &amp; Assessment Suite · Enterprise RBAC &amp; ISO 27001 Certified</p>
      </footer>
    </div>
  )
}
