import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { Activity, ArrowUpRight, Check, ChevronDown, ChevronUp, CircleAlert, CircleCheck, Clock3, Filter, Gauge, GitBranch, Layers as Layers3, Plus, RotateCw, Search, ShieldCheck, SlidersHorizontal, Sparkles, Users, X, Route, BookOpen, Target, CheckCircle2 } from 'lucide-react'
import { api } from '../lib/api'
import type { DifficultyClass, DifficultyRow, GovernanceStatus, GovernanceWaiver, LedgerAuditRow, QuestionBankRow, ASMLibraryRow, Tier, BankCoverageRow, AdminQuestionRow, AlreadyForkedCandidate } from '../types'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'

type View = 'overview' | 'pathway' | 'setup' | 'questions' | 'asm' | 'waivers' | 'difficulty' | 'ledger'
type SortDirection = 'asc' | 'desc'

const viewLabels: Record<View, string> = {
  overview: 'Cohort overview',
  pathway: 'Pathway selection & recommendation engine',
  setup: 'Assessment setup',
  questions: 'Question bank — maintenance',
  asm: 'ASM milestone library — admin',
  waivers: 'Waiver requests',
  difficulty: 'Difficulty engine',
  ledger: 'Enterprise credit ledger — all associates',
}

const tabs: { id: View; label: string; icon: typeof Users; badge?: string }[] = [
  { id: 'overview', label: 'Executive view', icon: Activity },
  { id: 'pathway', label: 'Pathway Panel', icon: Route, badge: '1' },
  { id: 'questions', label: 'Question Bank', icon: Layers3 },
  { id: 'asm', label: 'ASM Library', icon: GitBranch },
  { id: 'waivers', label: 'Waiver Requests', icon: ShieldCheck, badge: '1' },
  { id: 'difficulty', label: 'Difficulty Engine', icon: Gauge },
  { id: 'ledger', label: 'Ledger Audit', icon: Clock3 },
]

export function CommitteePortal() {
  const [params, setParams] = useSearchParams()
  const rawView = params.get('view') as View | null
  const view: View = rawView && rawView in viewLabels ? rawView : 'overview'
  const setView = (next: View) => setParams(next === 'overview' ? {} : { view: next })

  const overview = useQuery({ queryKey: ['committee-overview'], queryFn: api.committeeOverview })
  const bankCoverage = useQuery({ queryKey: ['committee-bank-coverage'], queryFn: api.bankCoverage, enabled: view === 'questions' })
  const adminQuestions = useQuery({ queryKey: ['committee-admin-questions'], queryFn: () => api.adminQuestions(), enabled: view === 'questions' })
  const alreadyForked = useQuery({ queryKey: ['already-forked'], queryFn: api.alreadyForked, enabled: view === 'pathway' })
  const asm = useQuery({ queryKey: ['committee-asm-library'], queryFn: api.asmLibrary, enabled: view === 'asm' })
  const waivers = useQuery({ queryKey: ['committee-waivers'], queryFn: api.governanceWaivers, enabled: view === 'waivers' })
  const difficulty = useQuery({ queryKey: ['committee-difficulty'], queryFn: api.difficultyEngine, enabled: view === 'difficulty' })
  const ledger = useQuery({ queryKey: ['committee-ledger'], queryFn: api.ledgerAudit, enabled: view === 'ledger' })
  const queryClient = useQueryClient()
  const [notice, setNotice] = useState('')

  async function runAction(area: string, id: string, action: string) {
    await api.updateGovernance(area, id, action)
    setNotice(`${action.replace('-', ' ')} recorded in the governance log`)
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['committee-overview'] }),
      queryClient.invalidateQueries({ queryKey: [`committee-${area}`] }),
    ])
    window.setTimeout(() => setNotice(''), 2800)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {view === 'questions' && 'ASSESSMENT DATABASE'}
            {view === 'pathway' && 'GATE 1 → FORK'}
            {view === 'asm' && 'STANDARDS & RUBRICS'}
            {view === 'ledger' && 'CREDIT ACCOUNTABILITY'}
            {view === 'overview' && 'ENGINEERING EXCELLENCE COMMITTEE'}
            {view === 'waivers' && 'ACCELERATION GOVERNANCE'}
            {view === 'difficulty' && 'CALIBRATION ENGINE'}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {viewLabels[view]}
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-slate-500">
            {view === 'questions' && '500 questions per course (100 per tier: Basic, Novice, Apprentice, Expert, Master). Randomized 5-question live tests.'}
            {view === 'pathway' && 'Algorithmic assessment + mentor evaluation to ratify DE / SE / CSE / IE pathway recommendations at Month 4.'}
            {view === 'asm' && 'ASM milestones, credit allocations, and rubric standards for the 24-month GDA acceleration.'}
            {view === 'ledger' && 'Immutable audit log of all assessment, milestone, and intensive credits earned across associates.'}
            {view === 'overview' && 'Standards, decisions, and audit signals for the ASCEND engineering talent system.'}
            {view === 'waivers' && 'Review and ratify acceleration waiver requests submitted by mentor coaches.'}
            {view === 'difficulty' && 'Dynamic Difficulty Engine calibration based on cohort pass rates and enterprise talent demands.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['committee-overview'] })}>
            <RotateCw size={14} />Refresh
          </Button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CircleCheck size={15} />{notice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-bold transition-colors ${
              view === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
            {tab.badge && (
              <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* View router */}
      {view === 'overview' && <Overview data={overview.data} isLoading={overview.isLoading} onOpen={setView} />}
      {view === 'pathway' && <PathwayForkPanel alreadyForked={alreadyForked.data || []} />}
      {view === 'questions' && <QuestionBankMaintenance coverage={bankCoverage.data || []} questions={adminQuestions.data || []} isLoading={bankCoverage.isLoading} />}
      {view === 'asm' && <ASMLibrary rows={asm.data || []} isLoading={asm.isLoading} onAction={runAction} />}
      {view === 'waivers' && <WaiverRequests rows={waivers.data || []} isLoading={waivers.isLoading} onAction={runAction} />}
      {view === 'difficulty' && <DifficultyEngine rows={difficulty.data || []} isLoading={difficulty.isLoading} onAction={runAction} />}
      {view === 'ledger' && <LedgerAudit rows={ledger.data || []} isLoading={ledger.isLoading} />}

      {/* Mockup footer metadata matching screenshot */}
      <div className="pt-6 text-[11px] text-slate-400 space-y-1">
        <p><strong>Program Deployment.</strong> Targeted for launch with the incoming global technology campus intake.</p>
        <p>Contact: Engineering Excellence Committee · technology.accelerator@wellsfargo.com</p>
        <p>ASCEND Mockup UI — data illustrative, sourced from the Graduate Developer Accelerator executive board proposal and the Advanced Systems Engineering / Agentic AI course outlines. Wire to LMS / Prometric / HRIS for production use.</p>
      </div>
    </div>
  )
}

function Overview({ data, isLoading, onOpen }: { data: ReturnType<typeof api.committeeOverview> extends Promise<infer T> ? T | undefined : never; isLoading: boolean; onOpen: (view: View) => void }) {
  if (isLoading || !data) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>
  }
  const metrics = [
    { label: 'Total associates', value: data.total_associates, detail: 'Across active cohorts', icon: Users, tone: 'blue' },
    { label: 'Assessment progress', value: `${data.assessment_progress}%`, detail: 'Course gates completed', icon: Check, tone: 'emerald' },
    { label: 'ASM completion', value: `${data.asm_completion}%`, detail: 'Milestones cleared', icon: GitBranch, tone: 'teal' },
    { label: 'At risk', value: data.at_risk, detail: 'Needs intervention', icon: CircleAlert, tone: 'amber' },
    { label: 'Pending waivers', value: data.pending_waivers, detail: 'Committee action', icon: ShieldCheck, tone: 'orange' },
    { label: 'Commission ready', value: data.commission_ready, detail: 'Ready for sponsor review', icon: CircleCheck, tone: 'navy' },
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        <Card className="overflow-hidden">
          <SectionHeader title="Pathway distribution" subtitle="Active associate mix by engineering discipline" action="Review pathways" onClick={() => onOpen('pathway')} />
          <div className="space-y-5 p-5">
            {data.pathway_distribution.map((item: any) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
                <ProgressBar value={item.value / 100} color={item.color} />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] text-slate-500">
            Distribution is calculated from current declared pathways.
          </div>
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader title="Governance activity" subtitle="Recent decisions and control changes" action="View audit" onClick={() => onOpen('ledger')} />
          <div className="divide-y divide-slate-100">
            {data.audit_events.map((event: any) => (

              <div key={event.title} className="flex gap-3 px-5 py-4">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${event.tone}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-slate-800">{event.title}</p>
                    <span className="shrink-0 text-[10px] text-slate-400">{event.time}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DecisionCard title="Question quality" value="500/course" detail="Coverage confirmed across 7 courses" action="Open question bank" onClick={() => onOpen('questions')} />
        <DecisionCard title="Waiver queue" value={`${data.pending_waivers} open`} detail="Decisions are due before next cohort gate" action="Review requests" onClick={() => onOpen('waivers')} />
        <DecisionCard title="Difficulty calibration" value="Balanced (1.27x)" detail="Dynamic engine responding to pipeline shortfall" action="Open engine" onClick={() => onOpen('difficulty')} />
      </div>
    </div>
  )
}

function PathwayForkPanel({ alreadyForked }: { alreadyForked: AlreadyForkedCandidate[] }) {
  return (
    <div className="space-y-6">
      {/* Month 4 Gate 1 Fork Card matching Screenshot 8 */}
      <Card className="p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white shadow-sm">
              FS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Fatima Sheikh</h3>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">Month 4</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Algorithmic Gate Assessment Complete · Data Engineering Alignment</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">1 Evaluation Pending Ratification</Badge>
        </div>

        {/* 4 Track Scores */}
        <div className="grid gap-3 sm:grid-cols-4 mb-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">DATA ENGINEERING</span>
            <p className="text-2xl font-black text-blue-900 mt-1">25 <span className="text-xs font-normal text-blue-700">/ 25</span></p>
            <p className="text-[10px] font-bold text-emerald-700 mt-1">Top Track Fit</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-center bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SOFTWARE ENG</span>
            <p className="text-2xl font-black text-slate-800 mt-1">23 <span className="text-xs font-normal text-slate-500">/ 25</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Strong Match</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-center bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CYBER SECURITY</span>
            <p className="text-2xl font-black text-slate-800 mt-1">23 <span className="text-xs font-normal text-slate-500">/ 25</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Strong Match</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-center bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">INFRASTRUCTURE</span>
            <p className="text-2xl font-black text-slate-800 mt-1">22 <span className="text-xs font-normal text-slate-500">/ 25</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Eligible</p>
          </div>
        </div>

        {/* Mentor Quote & Engine Agreement */}
        <div className="rounded-lg border border-slate-200 bg-[#fbfbf9] p-4 text-xs space-y-2 mb-6">
          <p className="font-bold text-slate-800">
            Mentor (Priya Nair): <span className="font-normal italic text-slate-600">"Strong algorithmic instincts; naturally gravitated to stream processing in the Week 6 distributed labs. DE is an outstanding fit for her capability profile."</span>
          </p>
          <p className="font-bold text-slate-800">
            Engine and mentor agree: <span className="text-emerald-700 font-bold">DE (Data Engineering)</span>
          </p>
        </div>

        {/* Panel Action matching Screenshot 8 */}
        <div className="flex flex-wrap items-center gap-3">
          <Button className="text-xs font-bold bg-[#1e3a66] text-white hover:bg-[#14294b]">
            Panel: Ratify &amp; Offer Pathway Options
          </Button>
          <Button variant="outline" className="text-xs">
            Open Evaluation Dossier
          </Button>
        </div>
      </Card>

      {/* Already Forked Section matching Screenshot 9 */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Already Forked</h3>
        <div className="divide-y divide-slate-100">
          {alreadyForked.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c1b33] text-xs font-bold text-white">
                  {c.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.detail}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">
                View profile →
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function QuestionBankMaintenance({ coverage, questions, isLoading }: { coverage: BankCoverageRow[]; questions: AdminQuestionRow[]; isLoading: boolean }) {
  return (
    <div className="space-y-8">
      {/* Coverage Table matching Screenshot 3 */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BANK COVERAGE TABLE</span>
          <h2 className="text-sm font-bold text-slate-900 mt-0.5">Course Coverage Across 5 Competence Tiers (100 Qs / Tier = 500 Total)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">COURSE</th>
                <th className="px-4 py-3.5 text-center">BASIC (L100)</th>
                <th className="px-4 py-3.5 text-center">NOVICE (L200)</th>
                <th className="px-4 py-3.5 text-center">APPRENTICE (L300)</th>
                <th className="px-4 py-3.5 text-center">EXPERT (L400)</th>
                <th className="px-4 py-3.5 text-center">MASTER (L500)</th>
                <th className="px-4 py-3.5 text-center">TOTAL</th>
                <th className="px-6 py-3.5 text-center">LIVE SAMPLE STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="p-4"><Skeleton className="h-4" /></td></tr>
                ))
              ) : (
                coverage.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{row.course}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">{row.basic}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">{row.novice}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">{row.apprentice}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">{row.expert}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">{row.master}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900">{row.total}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        row.live_sample_status === 'Yes'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                          : 'bg-amber-100 text-amber-800 border border-amber-300/60'
                      }`}>
                        {row.live_sample_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admin View Questions Table matching Screenshot 3 */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ADMIN VIEW</span>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">WF-101 Java 21 &amp; Secure AI Prompting — Sample Verification</h2>
          </div>
          <Link to="/take-assessment">
            <Button variant="outline" className="text-xs gap-1.5">
              <Target size={13} /> View Live Candidate Screen
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5 w-12 text-center">#</th>
                <th className="px-6 py-3.5">QUESTION</th>
                <th className="px-6 py-3.5">CORRECT ANSWER (ADMIN VIEW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400 text-center">{q.number}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 max-w-md">{q.question}</td>
                  <td className="px-6 py-4 font-bold text-emerald-800 bg-emerald-50/40">{q.correct_answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function ASMLibrary({ rows, isLoading, onAction }: TableProps<ASMLibraryRow>) {
  const [search, setSearch] = useState('')
  const filtered = rows.filter((row) => `${row.code} ${row.milestone} ${row.wf_course}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <GovernanceTable
      title="ASM Milestone Library — Admin"
      subtitle="Standardized milestones across Month 3 to Month 24 with assigned WF course mappings and rubric focuses."
      search={search}
      setSearch={setSearch}
      filters="All milestones"
      isLoading={isLoading}
      headers={['Code', 'Milestone', 'Month', 'WF course', 'Rubric focus', 'Credits', 'Status', 'Actions']}
      rows={filtered.map((row) => (
        <tr key={row.id}>
          <td className="font-mono font-bold text-blue-700">{row.code}</td>
          <td className="font-bold text-slate-800">{row.milestone}</td>
          <td className="font-mono">{row.month}</td>
          <td className="font-medium text-slate-700">{row.wf_course}</td>
          <td className="max-w-[260px] text-slate-600 text-[11px] leading-relaxed">{row.rubric_focus}</td>
          <td className="font-bold text-blue-600">+{row.credits}</td>
          <td><StatusBadge status={row.status} /></td>
          <td>
            <ActionButtons actions={[['Edit', 'edit'], ['Deactivate', 'deactivate']]} onAction={(action) => onAction('asm-library', row.id, action)} />
          </td>
        </tr>
      ))}
      empty="No ASM library entries match this search."
    />
  )
}

function WaiverRequests({ rows, isLoading, onAction }: TableProps<GovernanceWaiver>) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = rows.filter((row) => `${row.associate} ${row.course} ${row.milestone}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <GovernanceTable
      title="Waiver requests"
      subtitle="Make controlled, auditable decisions on accelerated course progression."
      search={search}
      setSearch={setSearch}
      filters="Pending only"
      isLoading={isLoading}
      headers={['Associate', 'Course', 'Milestone', 'Mentor recommendation', 'System reason', 'Status', 'Decision']}
      rows={filtered.map((row) => (
        <tr key={row.id}>
          <td>
            <div className="font-bold text-slate-800">{row.associate}</div>
            <div className="mt-1 text-[10px] text-slate-400">Request {row.id}</div>
          </td>
          <td className="font-semibold text-slate-700">{row.course}</td>
          <td>{row.milestone}</td>
          <td className="font-semibold text-emerald-700">{row.mentor_recommendation}</td>
          <td className="max-w-[240px] text-slate-500">{row.system_reason}</td>
          <td><StatusBadge status={row.status} /></td>
          <td>
            <div className="flex flex-wrap gap-1.5">
              {row.status === 'PENDING' && (
                <>
                  <button onClick={() => onAction('waivers', row.id, 'approve')} className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100">Approve</button>
                  <button onClick={() => onAction('waivers', row.id, 'reject')} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100">Reject</button>
                </>
              )}
              <button onClick={() => setSelected(selected === row.id ? null : row.id)} className="rounded border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50">{selected === row.id ? 'Close' : 'More info'}</button>
            </div>
            {selected === row.id && (
              <div className="mt-2 w-64 rounded border border-slate-200 bg-slate-50 p-2 text-[10px] leading-4 text-slate-500">
                {row.history.map((event) => (
                  <div key={event.date} className="border-b border-slate-200 py-1 last:border-0"><b>{event.label}</b> · {event.detail}</div>
                ))}
              </div>
            )}
          </td>
        </tr>
      ))}
      empty="No waiver requests match this search."
    />
  )
}

function DifficultyEngine({ rows, isLoading, onAction }: TableProps<DifficultyRow>) {
  const [search, setSearch] = useState('')
  const filtered = rows.filter((row) => `${row.course} ${row.tier} ${row.difficulty}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <GovernanceTable
      title="Difficulty engine"
      subtitle="Use cohort evidence to keep assessment difficulty calibrated."
      search={search}
      setSearch={setSearch}
      filters="All classifications"
      isLoading={isLoading}
      headers={['Course', 'Tier', 'Average score', 'Pass rate', 'Difficulty', 'Calibration', 'Control']}
      rows={filtered.map((row) => (
        <tr key={row.id}>
          <td className="font-bold text-slate-800">{row.course}</td>
          <td><TierBadge tier={row.tier} /></td>
          <td className="font-semibold">{row.average_score}%</td>
          <td><ValueBar value={row.pass_rate} /></td>
          <td><DifficultyBadge difficulty={row.difficulty} /></td>
          <td>
            <div className="flex items-center gap-2">
              <input aria-label={`Calibration for ${row.course}`} type="range" min="-10" max="10" defaultValue={row.calibration} className="accent-blue-600" />
              <span className="w-8 text-right text-[10px] font-bold text-slate-600">{row.calibration > 0 ? '+' : ''}{row.calibration}</span>
            </div>
          </td>
          <td>
            <button onClick={() => onAction('difficulty', row.id, 'calibrate')} className="rounded border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              Apply calibration
            </button>
          </td>
        </tr>
      ))}
      empty="No difficulty records match this search."
    />
  )
}

function LedgerAudit({ rows, isLoading }: { rows: LedgerAuditRow[]; isLoading: boolean }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: keyof LedgerAuditRow; direction: SortDirection }>({ key: 'date', direction: 'desc' })
  const filtered = rows
    .filter((row) => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const left = String(a[sort.key])
      const right = String(b[sort.key])
      return left.localeCompare(right) * (sort.direction === 'asc' ? 1 : -1)
    })
  const toggleSort = (key: keyof LedgerAuditRow) =>
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))

  return (
    <GovernanceTable
      title="Enterprise Credit Ledger — All Associates"
      subtitle="Complete 15-entry verified ledger of credits awarded across D1-D4 and L100-L400 levels."
      search={search}
      setSearch={setSearch}
      filters="All domains"
      isLoading={isLoading}
      headers={['Associate', 'Date', 'Domain', 'Instrument', 'Level', 'Credits', 'Source', 'Status']}
      sortHeaders={['Associate', 'Date', 'Domain', 'Instrument', 'Level', 'Credits', 'Source', 'Status']}
      onSort={toggleSort}
      rows={filtered.map((row) => (
        <tr key={row.id}>
          <td className="font-bold text-slate-800">{row.associate}</td>
          <td className="whitespace-nowrap font-mono text-slate-500">{row.date}</td>
          <td><span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{row.domain}</span></td>
          <td className="font-semibold text-slate-900">{row.instrument}</td>
          <td><Badge>{row.level}</Badge></td>
          <td className="font-bold text-blue-600">+{row.credits}</td>
          <td className="text-slate-500">{row.source}</td>
          <td><StatusBadge status={row.status} /></td>
        </tr>
      ))}
      empty="No ledger entries match this search."
    />
  )
}

type TableProps<T> = { rows: T[]; isLoading: boolean; onAction: (area: string, id: string, action: string) => Promise<void> }

function GovernanceTable({ title, subtitle, search, setSearch, filters, headers, sortHeaders, onSort, rows, empty, isLoading }: { title: string; subtitle: string; search: string; setSearch: (value: string) => void; filters: string; headers: string[]; sortHeaders?: string[]; onSort?: (key: keyof LedgerAuditRow) => void; rows: React.ReactNode[]; empty: string; isLoading: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" className="h-9 w-56 rounded border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-400" />
            </div>
            <button className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Filter size={14} />{filters}<ChevronDown size={13} />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {headers.map((header, index) => (
                <th key={header} className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-bold">
                  {onSort && sortHeaders?.[index] === header ? (
                    <button onClick={() => onSort(header.toLowerCase().replace(/ /g, '_') as keyof LedgerAuditRow)} className="inline-flex items-center gap-1">
                      {header}<ChevronUp size={12} />
                    </button>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length ? (
              rows
            ) : (
              <tr><td colSpan={headers.length} className="px-5 py-12 text-center text-xs text-slate-400">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] text-slate-400">
        <span>Showing {rows.length} records</span>
        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-600" />Standards ratified by Engineering Excellence Committee</span>
      </div>
    </Card>
  )
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: typeof Users; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-700', emerald: 'bg-emerald-50 text-emerald-700', teal: 'bg-teal-50 text-teal-700', amber: 'bg-amber-50 text-amber-700', orange: 'bg-orange-50 text-orange-700', navy: 'bg-slate-100 text-slate-700' }
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-md ${tones[tone]}`}>
          <Icon size={17} />
        </div>
      </div>
    </Card>
  )
}

function SectionHeader({ title, subtitle, action, onClick }: { title: string; subtitle: string; action: string; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
      </div>
      <button onClick={onClick} className="hidden items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 sm:flex">
        {action}<ArrowUpRight size={13} />
      </button>
    </div>
  )
}

function DecisionCard({ title, value, detail, action, onClick }: { title: string; value: string; detail: string; action: string; onClick: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-800">{title}</p>
        <Sparkles size={15} className="text-blue-600" />
      </div>
      <p className="mt-4 text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{detail}</p>
      <button onClick={onClick} className="mt-4 text-[11px] font-bold text-blue-700 hover:text-blue-800">
        {action} <ArrowUpRight size={12} className="inline" />
      </button>
    </Card>
  )
}

function ValueBar({ value }: { value: number }) {
  return (
    <div className="flex min-w-[90px] items-center gap-2">
      <ProgressBar value={value / 100} color={value >= 80 ? 'bg-emerald-500' : 'bg-amber-500'} className="w-16" />
      <span className="text-[11px] font-bold text-slate-700">{value}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: GovernanceStatus | string }) {
  const styles: Record<string, string> = {
    LIVE: 'bg-emerald-50 text-emerald-700',
    DRAFT: 'bg-slate-100 text-slate-600',
    DEACTIVATED: 'bg-red-50 text-red-700',
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    MORE_INFO: 'bg-blue-50 text-blue-700',
  }
  return <Badge className={styles[status] || 'bg-slate-100 text-slate-600'}>{status.replace(/_/g, ' ')}</Badge>
}

function TierBadge({ tier }: { tier: Tier }) {
  return <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{tier}</span>
}

function DifficultyBadge({ difficulty }: { difficulty: DifficultyClass }) {
  const styles: Record<DifficultyClass, string> = {
    'Too Easy': 'bg-blue-50 text-blue-700',
    Balanced: 'bg-emerald-50 text-emerald-700',
    'Too Difficult': 'bg-amber-50 text-amber-700',
  }
  return <Badge className={styles[difficulty]}>{difficulty}</Badge>
}

function ActionButtons({ actions, onAction }: { actions: [string, string][]; onAction: (action: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map(([label, action]) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="rounded border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
