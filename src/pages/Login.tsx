import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, Briefcase, Award, Network, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { RoleId } from '../types'
import { Button, Card, Badge } from '../components/ui'

interface PersonaCard {
  role: RoleId
  personaId: string
  name: string
  title: string
  email: string
  badge: string
  description: string
  icon: React.ElementType
  color: string
}

const PERSONAS: PersonaCard[] = [
  {
    role: 'EARLY_TALENT',
    personaId: 'u-ananya',
    name: 'Ananya Rao',
    title: 'Associate Software Engineer',
    email: 'ananya.rao@wellsfargo.com',
    badge: 'GDA Cohort 2025',
    description: 'Access HackerRank IDE, live coding challenges, ASM milestones, and Enterprise Credit Ledger.',
    icon: Sparkles,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    role: 'MENTOR_COACH',
    personaId: 'u-priya',
    name: 'Priya Nair',
    title: 'Lead Systems Architect & Mentor Coach',
    email: 'priya.nair@wellsfargo.com',
    badge: 'Engineering Mentor',
    description: 'Review mentee PR submissions, evaluate code quality, endorse waivers, and score Architect Board defenses.',
    icon: Users,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    role: 'ENGINEERING_EXCELLENCE_COMMITTEE',
    personaId: 'u-committee',
    name: 'Excellence Committee',
    title: 'Curriculum & Governance Board',
    email: 'engineering.excellence@wellsfargo.com',
    badge: 'Program Governance',
    description: 'Maintain 500-question banks, author coding challenges, ratify Gate 1 Pathway forks, and audit ledger.',
    icon: Award,
    color: 'from-purple-600 to-indigo-800',
  },
  {
    role: 'SENIOR_LEADER_SPONSOR',
    personaId: 'u-sponsor',
    name: 'Senior Leader Sponsor',
    title: 'Head of Engineering Talent & VP',
    email: 'talent.sponsor@wellsfargo.com',
    badge: 'Executive Sponsor',
    description: 'Monitor dual-bar demand vs supply pipeline, calibrate dynamic difficulty, and approve fast-track promotions.',
    icon: Briefcase,
    color: 'from-amber-600 to-orange-700',
  },
  {
    role: 'TECHNOLOGY_HEAD',
    personaId: 'u-techhead',
    name: 'Technology Head',
    title: 'Chief Technology Officer / Global Head',
    email: 'technology.head@wellsfargo.com',
    badge: 'Enterprise Leadership',
    description: 'Cross-cutting D2/D3 platform readiness heatmap, stack competency radar, and production commissioning sign-off.',
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
      setError('Please enter your Wells Fargo email address.')
      return
    }
    setIsLoading(true)
    setError(null)
    const success = await login(email)
    setIsLoading(false)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid credentials or persona not found.')
    }
  }

  const handlePersonaSelect = async (personaId: string) => {
    setIsLoading(true)
    setError(null)
    const success = await login(personaId)
    setIsLoading(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071326] via-[#0c1e3d] to-[#12284e] text-slate-100 flex flex-col justify-between p-6">
      {/* Top Brand Nav */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-black text-xl text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">ASCEND</span>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                PROD v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Graduate Developer Accelerator &amp; Assessment Suite</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Enterprise SSO · Wells Fargo Single Sign-On</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full py-8 grid gap-8 lg:grid-cols-[1fr_1.3fr] items-center">
        {/* Left: Credential Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">SECURE ACCESS PORTAL</span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineering Talent Acceleration &amp; Assessment
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Sign in with your enterprise credentials or choose a quick-access persona to test role-specific workflows across coding assessments, mentoring, curriculum governance, and talent sponsorship.
            </p>
          </div>

          <Card className="border-slate-800 bg-[#0f244a]/80 backdrop-blur-md p-6 shadow-2xl text-slate-100">
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
                    placeholder="name@wellsfargo.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {isLoading ? 'Authenticating...' : 'Sign In with SSO'}
                <ArrowRight size={14} />
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Right: Quick Persona Switcher */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">INSTANT DEMO PERSONAS</span>
              <h2 className="text-base font-bold text-white">Select a Role Persona to Explore</h2>
            </div>
            <span className="text-xs text-slate-400">Click to switch instantly</span>
          </div>

          <div className="grid gap-3">
            {PERSONAS.map((persona, index) => {
              const Icon = persona.icon
              return (
                <button
                  key={persona.personaId}
                  onClick={() => handlePersonaSelect(persona.personaId)}
                  className="group w-full rounded-xl border border-slate-800 bg-[#0c1f40]/70 p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-500 hover:bg-[#112a57] hover:shadow-xl hover:shadow-blue-500/10 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${persona.color} text-white shadow-md`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {persona.name}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                          {persona.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{persona.title}</p>
                      <p className="text-[11px] text-slate-300/80 mt-1.5 line-clamp-2 leading-relaxed">
                        {persona.description}
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
        <p>ASCEND Integrated Talent Acceleration &amp; HackerRank Assessment Suite · Engineering Excellence Committee</p>
      </footer>
    </div>
  )
}
