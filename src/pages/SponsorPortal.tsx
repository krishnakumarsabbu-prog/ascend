import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TriangleAlert as AlertTriangle, ArrowUpRight, Briefcase, CircleCheck as CheckCircle2, ChevronRight, Gauge, GitBranch, Layers as Layers3, Lightbulb, ShieldCheck, TrendingDown, TrendingUp, Users, Zap, Check, X, Network, Sliders, Target, Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import type { Recommendation, SponsoredASM, TeamPipeline, WorkforceRisk, SponsorApproval } from '../types'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'
import { AIExecutiveIntelligence } from '../components/ai/AIExecutiveIntelligence'

const riskStyles: Record<WorkforceRisk, { dot: string; badge: string; bar: string; label: string }> = {
  Healthy: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', label: 'Healthy' },
  Watch: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', label: 'Watch' },
  'High Demand': { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700', bar: 'bg-orange-500', label: 'High Demand' },
  'Critical Shortfall': { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700', bar: 'bg-red-500', label: 'Critical Shortfall' },
}

export function SponsorPortal() {
  const [params, setParams] = useSearchParams()
  const view = params.get('view') || 'demand'
  const setView = (next: string) => setParams(next === 'demand' ? {} : { view: next })

  const demand = useQuery({ queryKey: ['demand-overview'], queryFn: api.demand })
  const recommendations = useQuery({ queryKey: ['workforce-recommendations'], queryFn: api.workforceRecommendations })
  const sponsored = useQuery({ queryKey: ['sponsored-asm'], queryFn: api.sponsoredAsm })
  const approvalsQuery = useQuery({ queryKey: ['sponsor-approvals'], queryFn: api.sponsorApprovals })
  const queryClient = useQueryClient()

  const [selectedTeamId, setSelectedTeamId] = useState<string>('all')
  const [demandIndex, setDemandIndex] = useState(80)

  const teams: TeamPipeline[] = demand.data?.teams || []

  const filteredTeams = useMemo(() => {
    if (selectedTeamId === 'all') return teams
    return teams.filter((t) => t.id === selectedTeamId)
  }, [teams, selectedTeamId])

  const tabs = [
    { id: 'demand', label: 'Demand & Pipeline', icon: Briefcase },
    { id: 'ai-intel', label: 'AI Executive Intel', badge: 'AI', icon: Sparkles },
    { id: 'difficulty', label: 'Dynamic Difficulty Engine', icon: Target },
    { id: 'sponsored', label: 'Sponsored ASM Milestones', icon: GitBranch },
    { id: 'approvals', label: 'Approvals', badge: '1', icon: ShieldCheck },
    { id: 'architect', label: 'Architect Board Panel', icon: Network },
  ]

  const decideApproval = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api.decideSponsorApproval(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sponsor-approvals'] }),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {view === 'demand' && 'TEAM DEMAND & PIPELINE VIEW'}
            {view === 'ai-intel' && 'AI EXECUTIVE INTELLIGENCE'}
            {view === 'difficulty' && 'DYNAMIC DIFFICULTY ENGINE'}
            {view === 'sponsored' && 'BUSINESS SPONSORSHIPS'}
            {view === 'approvals' && 'EXECUTIVE RATIFICATION'}
            {view === 'architect' && 'DEFENSE EVALUATION'}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {view === 'demand' && 'Demand & Pipeline View'}
            {view === 'ai-intel' && 'AI Executive Intelligence & Strategy'}
            {view === 'difficulty' && 'Dynamic Difficulty Engine'}
            {view === 'sponsored' && 'Sponsored ASM Milestones'}
            {view === 'approvals' && 'Fast-Track & One-Level-Up Approvals'}
            {view === 'architect' && 'Architect Board Panel'}
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-slate-500">
            {view === 'demand' && 'Dual-bar view: open requisitions vs capstone-ready associates by team. Live from the ASCEND workforce pipeline.'}
            {view === 'ai-intel' && 'Natural-language queries across cross-cohort telemetry, workforce supply forecasts, and enterprise skill shortages.'}
            {view === 'difficulty' && 'Calibrate assessment strictness and runtime difficulty multiplier according to enterprise talent demand.'}
            {view === 'sponsored' && 'Track live production problem milestones sponsored directly by engineering business units.'}
            {view === 'approvals' && 'Executive sponsor sign-off on accelerated promotion and fast-track curriculum waivers.'}
            {view === 'architect' && 'Review and ratify architectural defense presentations from candidate associates.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-bold transition-colors ${
              view === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.badge && (
              <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* View: Demand & Pipeline (Matching Screenshot 10) */}
      {view === 'demand' && (
        <div className="space-y-6">
          {/* Team Focus Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700">My Team Focus:</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.lead})</option>
              ))}
            </select>
          </div>

          {/* Dual-Bar Chart Card matching Screenshot 10 */}
          <Card className="p-6 border-slate-200">
            <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PIPELINE COMPARISON</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Open Requisitions (Demand) vs Capstone-Ready Associates (Supply)</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#1e293b]" />
                  <span className="text-slate-600">Open Requisitions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                  <span className="text-slate-600">Capstone-Ready</span>
                </div>
              </div>
            </div>

            {/* Dual Bar Render */}
            <div className="space-y-6">
              {filteredTeams.map((team) => (
                <div key={team.id} className="rounded-lg border border-slate-100 p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{team.name}</span>
                      <span className="text-[11px] text-slate-500 ml-2">· Lead: {team.lead}</span>
                    </div>
                    <Badge className={riskStyles[team.risk].badge}>{riskStyles[team.risk].label}</Badge>
                  </div>

                  <div className="space-y-2">
                    {/* Bar 1: Demand */}
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-[10px] font-bold text-slate-500 uppercase">Demand</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-[#1e293b] rounded-full" style={{ width: `${Math.min(100, team.demand * 15)}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-xs font-bold text-slate-800">{team.demand}</span>
                    </div>

                    {/* Bar 2: Capstone Ready */}
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-[10px] font-bold text-slate-500 uppercase">Ready</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, team.ready * 15)}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-xs font-bold text-emerald-700">{team.ready}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Team Shortfall Alert Card matching Screenshot 10 */}
          <Card className="p-6 border-amber-200 bg-amber-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle size={17} className="text-amber-600" />
                  Team Shortfall: AI / Bedrock Enablement
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Demand shortfall of 5 engineers. Accelerate Month 4 pathway forks and open dynamic difficulty engine.
                </p>
              </div>
              <Button
                onClick={() => setView('difficulty')}
                className="text-xs font-bold bg-[#1e3a66] text-white hover:bg-[#14294b] shrink-0"
              >
                Open Difficulty Engine →
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* View: AI Executive Intelligence */}
      {view === 'ai-intel' && (
        <AIExecutiveIntelligence role="SENIOR_LEADER_SPONSOR" />
      )}

      {/* View: Dynamic Difficulty Engine (Matching Screenshot 11) */}
      {view === 'difficulty' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">TALENT DEMAND CALIBRATION</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Dynamic Difficulty Multiplier</h3>
                <p className="text-xs text-slate-500 mt-1">Adjusts assessment and ASM rubric strictness in response to business demand signals.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-blue-700">1.27x</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Difficulty Multiplier</p>
              </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Demand Index Slider:</span>
                  <span className="text-blue-700">{demandIndex} / 100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={demandIndex}
                  onChange={(e) => setDemandIndex(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ASSIGNED TIER</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">Tier 4 (Accelerated / Strict)</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RUBRIC POLICY</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">Production-Grade Fault Tolerance</p>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900">
                <strong>Active Engine Output:</strong> High-throughput distributed systems &amp; concurrent fault injection are now mandatory evaluation criteria for Month 6+ milestones.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* View: Sponsored ASM Milestones (Matching Screenshot 12) */}
      {view === 'sponsored' && (
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SPONSORED ASM MILESTONES</span>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">Active Live-Problem Milestones Sponsored by Engineering Business Units</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">ASSOCIATE</th>
                  <th className="px-6 py-3.5">BUSINESS TEAM</th>
                  <th className="px-6 py-3.5">SPONSORED ASM</th>
                  <th className="px-6 py-3.5">TARGET MONTH</th>
                  <th className="px-6 py-3.5 text-center">IMPACT</th>
                  <th className="px-6 py-3.5 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { associate: 'Ananya Rao', team: 'Payments Engineering', asm: 'ASM-103 Multi-Tenant Migration', month: 'Month 12', impact: 'High (3 Roles)', status: 'Active' },
                  { associate: 'Karthik Iyer', team: 'Cloud & Site Reliability Engineering', asm: 'ASM-202 Chaos Simulation & Resilience', month: 'Month 18', impact: 'Critical (2 Roles)', status: 'Active' },
                  { associate: 'Fatima Sheikh', team: 'AI / Bedrock Enablement', asm: 'ASM-203 Enterprise Agentic RAG Platform', month: 'Month 24', impact: 'Strategic (5 Roles)', status: 'Active' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{row.associate}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{row.team}</td>
                    <td className="px-6 py-4 font-bold text-blue-700">{row.asm}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{row.month}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-700">{row.impact}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300">{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View: Approvals (Matching Screenshot 13) */}
      {view === 'approvals' && (
        <div className="space-y-4">
          {(approvalsQuery.data || [
            { id: 'app-ananya', associate_name: 'Ananya Rao', type: 'Fast-Track', requested_date: '2026-08-15', cohort: 'Cohort 2025', target_team: 'Payments Engineering', status: 'PENDING' },
            { id: 'app-karthik', associate_name: 'Karthik Iyer', type: 'One-Level-Up', requested_date: '2026-07-20', cohort: 'Cohort 2025', target_team: 'Cloud & Site Reliability Engineering', status: 'APPROVED' },
          ]).map((approval) => (
            <Card key={approval.id} className="p-6 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {approval.associate_name} — {approval.type}
                    </h3>
                    <Badge className={approval.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800'}>
                      {approval.status === 'APPROVED' ? 'sponsor-approved' : 'pending sponsor approval'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {approval.cohort} · Target Team: <strong>{approval.target_team}</strong> · Requested: <span className="font-mono">{approval.requested_date}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                    {approval.type === 'Fast-Track'
                      ? 'Candidate has satisfied all D1/D2 criteria 4 months ahead of schedule. Fast-track approval accelerates associate transition into live payments platform sprint cycles.'
                      : 'Candidate has cleared 7/7 ASM milestones with distinction and defended RFC on distributed consensus. One-level-up elevation to autonomous Senior Associate Engineer.'}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  {approval.status === 'PENDING' ? (
                    <>
                      <Button
                        onClick={() => decideApproval.mutate({ id: approval.id, action: 'approve' })}
                        className="text-xs font-bold bg-[#1e3a66] text-white hover:bg-[#14294b]"
                      >
                        <Check size={13} /> Approve
                      </Button>
                      <Button
                        onClick={() => decideApproval.mutate({ id: approval.id, action: 'reject' })}
                        variant="outline"
                        className="text-xs"
                      >
                        <X size={13} /> Reject
                      </Button>
                    </>
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-800">Approved &amp; Recorded</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View: Architect Board Panel (Matching Screenshot 14) */}
      {view === 'architect' && (
        <SponsorArchitectPanel />
      )}

      {/* Mockup footer metadata matching screenshot */}
      <div className="pt-6 text-[11px] text-slate-400 space-y-1">
        <p><strong>Program Deployment.</strong> Targeted for launch with the incoming global technology campus intake.</p>
        <p>Contact: Engineering Excellence Committee · technology.accelerator@wellsfargo.com</p>
        <p>ASCEND Mockup UI — data illustrative, sourced from the Graduate Developer Accelerator executive board proposal and the Advanced Systems Engineering / Agentic AI course outlines. Wire to LMS / Prometric / HRIS for production use.</p>
      </div>
    </div>
  )
}

function SponsorArchitectPanel() {
  const [score, setScore] = useState('4.5')
  const [submittedScore, setSubmittedScore] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const scoreMutation = useMutation({
    mutationFn: () => api.scoreArchitectDefense('as-ananya', parseFloat(score) || 4.5),
    onSuccess: () => {
      setSubmittedScore(parseFloat(score))
      queryClient.invalidateQueries({ queryKey: ['architect-defenses'] })
    },
  })

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ARCHITECT BOARD DEFENSES</span>
          <h2 className="text-base font-bold text-slate-900">Ananya Rao — ASM-104 RFC Board Defense</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">ASSOCIATE</th>
                <th className="px-6 py-3.5">TOPIC</th>
                <th className="px-6 py-3.5">PANEL</th>
                <th className="px-6 py-3.5">DATE</th>
                <th className="px-6 py-3.5 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-900">Ananya Rao</td>
                <td className="px-6 py-4 text-slate-700">Payments Core RFC Architecture</td>
                <td className="px-6 py-4 text-slate-600">Priya Nair, Vikram Desai, Suresh Pillai</td>
                <td className="px-6 py-4 font-mono text-slate-500">2026-08-28 (STREAM 04/05)</td>
                <td className="px-6 py-4 text-center">
                  <Badge className={submittedScore ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                    {submittedScore ? `Scored (${submittedScore}/5.0)` : 'Scheduled'}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Panel Actions &amp; Rubric Scoring</h3>
        <p className="text-xs text-slate-500 mb-4">Enter panel rubric evaluation score (Scale 1.0 - 5.0) to complete the defense ratification.</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Score:</label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
            />
          </div>
          <Button
            onClick={() => scoreMutation.mutate()}
            disabled={scoreMutation.isPending}
            className="text-xs font-bold bg-[#1e3a66] text-white hover:bg-[#14294b]"
          >
            {scoreMutation.isPending ? 'Submitting...' : 'Submit Panel Score'}
          </Button>
          {submittedScore && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check size={14} /> Score {submittedScore} recorded!
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}
