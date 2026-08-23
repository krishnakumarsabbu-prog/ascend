import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Gauge,
  GitBranch,
  Layers3,
  Lightbulb,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Recommendation, SponsoredASM, TeamPipeline, WorkforceRisk } from '../types'
import { Badge, Card, ProgressBar, Skeleton } from '../components/ui'

const riskStyles: Record<WorkforceRisk, { dot: string; badge: string; bar: string; label: string }> = {
  Healthy: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', label: 'Healthy' },
  Watch: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', label: 'Watch' },
  'High Demand': { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700', bar: 'bg-orange-500', label: 'High Demand' },
  'Critical Shortfall': { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700', bar: 'bg-red-500', label: 'Critical Shortfall' },
}

const priorityStyles: Record<string, string> = {
  P0: 'bg-red-50 text-red-700',
  P1: 'bg-orange-50 text-orange-700',
  P2: 'bg-amber-50 text-amber-700',
  P3: 'bg-slate-100 text-slate-600',
}

const impactStyles: Record<string, string> = {
  High: 'text-red-600',
  Medium: 'text-orange-600',
  Low: 'text-emerald-600',
}

export function SponsorPortal() {
  const demand = useQuery({ queryKey: ['demand-overview'], queryFn: api.demand })
  const recommendations = useQuery({ queryKey: ['workforce-recommendations'], queryFn: api.workforceRecommendations })
  const sponsored = useQuery({ queryKey: ['sponsored-asm'], queryFn: api.sponsoredAsm })
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const teams: TeamPipeline[] = demand.data?.teams || []
  const selectedTeam = useMemo<TeamPipeline | undefined>(
    () => teams.find((t) => t.id === selectedTeamId) || teams[0],
    [teams, selectedTeamId],
  )

  if (demand.isLoading || !demand.data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
      </div>
    )
  }

  const overview = demand.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Workforce intelligence command center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Demand &amp; Pipeline Intelligence</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Connect strategic engineering demand to a ready, developing talent pipeline. Track shortfall, risk, and sponsored milestone capacity across teams.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] font-semibold text-slate-400 sm:inline">Live demand signal</span>
          <Badge className="bg-emerald-50 text-emerald-700"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />Synced</Badge>
        </div>
      </div>

      {/* Executive KPI hierarchy */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={<Briefcase size={18} />} label="Total open demand" value={overview.total_demand} detail="Across all engineering teams" tone="blue" />
        <KpiCard icon={<CheckCircle2 size={18} />} label="Ready associates" value={overview.total_ready} detail={`${overview.readiness}% pipeline readiness`} tone="emerald" />
        <KpiCard icon={<AlertTriangle size={18} />} label="Shortfall" value={overview.total_shortfall} detail="Roles unfilled by ready talent" tone="amber" />
        <KpiCard icon={<Gauge size={18} />} label="Teams at risk" value={overview.risk_distribution['High Demand'] + overview.risk_distribution['Critical Shortfall']} detail="High demand or critical shortfall" tone="red" />
      </div>

      {/* Risk distribution strip */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Workforce risk distribution</h2>
            <p className="mt-0.5 text-xs text-slate-400">Team-level intelligence bands across the portfolio</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {(Object.keys(overview.risk_distribution) as WorkforceRisk[]).map((band) => (
              <div key={band} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${riskStyles[band].dot}`} />
                <span className="text-xs font-semibold text-slate-600">{riskStyles[band].label}</span>
                <span className="text-sm font-bold text-slate-900">{overview.risk_distribution[band]}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Team demand & pipeline view */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        {/* Team comparison list */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-bold text-slate-900">Team demand &amp; pipeline</h2>
            <p className="mt-0.5 text-xs text-slate-400">Select a team to inspect its detail. Horizontal bars compare demand vs ready supply.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {teams.map((team, index) => {
              const isSelected = selectedTeam?.id === team.id
              const maxDemand = Math.max(...teams.map((t) => t.demand), 1)
              const readyPct = (team.ready / maxDemand) * 100
              const demandPct = (team.demand / maxDemand) * 100
              return (
                <motion.button
                  key={team.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full px-5 py-4 text-left transition-colors ${isSelected ? 'bg-amber-50/60' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{team.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">Lead: {team.lead}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge className={riskStyles[team.risk].badge}>{riskStyles[team.risk].label}</Badge>
                      <ChevronRight size={14} className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90 text-amber-600' : ''}`} />
                    </div>
                  </div>
                  {/* Horizontal demand vs supply comparison */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-12 shrink-0 text-[10px] font-semibold uppercase text-slate-400">Demand</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-700 transition-all duration-700" style={{ width: `${demandPct}%` }} />
                      </div>
                      <span className="w-6 shrink-0 text-right text-[11px] font-bold text-slate-700">{team.demand}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 shrink-0 text-[10px] font-semibold uppercase text-slate-400">Ready</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full transition-all duration-700 ${riskStyles[team.risk].bar}`} style={{ width: `${readyPct}%` }} />
                      </div>
                      <span className="w-6 shrink-0 text-right text-[11px] font-bold text-slate-700">{team.ready}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-400">
                    <span>Shortfall <b className="text-slate-700">{team.shortfall}</b></span>
                    <span>Readiness <b className="text-slate-700">{team.readiness}%</b></span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Card>

        {/* Detail panel */}
        <TeamDetail team={selectedTeam} />
      </div>

      {/* Recommendations + Sponsored ASM */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <RecommendationsPanel recs={recommendations.data || []} isLoading={recommendations.isLoading} />
        <SponsoredAsmPanel items={sponsored.data || []} isLoading={sponsored.isLoading} />
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: number; detail: string; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-700', emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', red: 'bg-red-50 text-red-700' }
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-md ${tones[tone]}`}>{icon}</div>
      </div>
    </Card>
  )
}

function TeamDetail({ team }: { team?: TeamPipeline }) {
  if (!team) return <Card className="flex h-80 items-center justify-center text-sm text-slate-400">Select a team to view detail</Card>
  const risk = riskStyles[team.risk]
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{team.name}</h2>
            <p className="mt-0.5 text-xs text-slate-400">{team.focus}</p>
          </div>
          <Badge className={risk.badge}><span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${risk.dot}`} />{risk.label}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
        <DetailStat label="Open roles" value={team.demand} icon={<Briefcase size={14} />} />
        <DetailStat label="Ready" value={team.ready} icon={<CheckCircle2 size={14} />} tone="emerald" />
        <DetailStat label="Shortfall" value={team.shortfall} icon={<AlertTriangle size={14} />} tone="amber" />
        <DetailStat label="Readiness" value={`${team.readiness}%`} icon={<Gauge size={14} />} tone="blue" />
      </div>
      <div className="space-y-5 p-5">
        {/* Readiness gauge */}
        <div>
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Pipeline readiness</span>
            <span className="font-bold text-slate-900">{team.readiness}%</span>
          </div>
          <ProgressBar value={team.readiness / 100} color={risk.bar} />
        </div>

        {/* Pathway demand breakdown */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Pathway demand</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(team.pathway_demand).map(([code, count]) => (
              <div key={code} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5">
                <span className="font-mono text-[11px] font-bold text-slate-700">{code}</span>
                <span className="text-xs font-bold text-slate-900">{count}</span>
                <span className="text-[10px] text-slate-400">roles</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Open roles</p>
          <div className="space-y-2">
            {team.open_roles.map((role, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{role.title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{role.pathway} · {role.skill_level} · Target month {role.target_month}</p>
                </div>
                <Badge className={priorityStyles[role.priority] || 'bg-slate-100 text-slate-600'}>{role.priority}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Ready associates */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Ready associates ({team.ready_associates.length})</p>
          {team.ready_associates.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 px-3 py-4 text-center text-[11px] text-slate-400">No ready associates yet for this team's demand.</div>
          ) : (
            <div className="space-y-2">
              {team.ready_associates.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c1b33] text-[9px] font-bold text-white">{a.name.split(' ').map((n) => n[0]).join('')}</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{a.name}</p>
                      <p className="text-[10px] text-slate-400">{a.pathway} · Month {a.current_month}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16"><ProgressBar value={a.readiness / 100} color="bg-emerald-500" /></div>
                    <span className="text-[11px] font-bold text-slate-700">{a.readiness}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function DetailStat({ label, value, icon, tone }: { label: string; value: string | number; icon: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = { emerald: 'text-emerald-600', amber: 'text-amber-600', blue: 'text-blue-600' }
  return (
    <div className="bg-white px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">{icon}{label}</div>
      <p className={`mt-1 text-lg font-bold ${tone ? tones[tone] : 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

function RecommendationsPanel({ recs, isLoading }: { recs: Recommendation[]; isLoading: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-600" />
          <h2 className="text-sm font-bold text-slate-900">Workforce recommendations</h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">Backend-generated actions to close demand gaps</p>
      </div>
      <div className="divide-y divide-slate-100">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="px-5 py-4"><Skeleton className="h-14" /></div>)
          : recs.map((rec) => (
              <div key={rec.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={priorityStyles[rec.priority]}>{rec.priority}</Badge>
                    <p className="text-xs font-bold text-slate-800">{rec.action}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold ${impactStyles[rec.impact]}`}>
                    {rec.impact === 'High' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}{rec.impact} impact
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{rec.detail}</p>
                <p className="mt-1.5 text-[10px] text-slate-400">{rec.team}</p>
              </div>
            ))}
      </div>
    </Card>
  )
}

function SponsoredAsmPanel({ items, isLoading }: { items: SponsoredASM[]; isLoading: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Sponsored ASM milestones</h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">Business-sponsored milestone capacity and its demand impact</p>
      </div>
      <div className="divide-y divide-slate-100">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="px-5 py-4"><Skeleton className="h-20" /></div>)
          : items.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700"><Layers3 size={15} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.associate_name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{item.business_team}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-700">{item.asm_code}</Badge>
                    <Badge className={priorityStyles[item.priority] || 'bg-slate-100 text-slate-600'}>{item.priority}</Badge>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{skill}</span>)}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-600" />{item.pipeline}</span>
                  <span>Target month {item.target_month}</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-700"><Zap size={11} />{item.demand_impact} role impact</span>
                </div>
              </div>
            ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] text-slate-400">
        <span>{items.length} sponsored milestones</span>
        <button className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800">Review sponsorships <ArrowUpRight size={12} /></button>
      </div>
    </Card>
  )
}
