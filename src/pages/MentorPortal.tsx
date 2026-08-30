import { type ReactNode, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, CircleAlert, ClipboardList, Flag, Layers as Layers3, Plus, ShieldCheck, Target, UserRound, X, Network, Route, AlertCircle, Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import type { DevelopmentGoal, MentorMentee, User, Waiver } from '../types'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'
import { AIMentorAssistant } from '../components/ai/AIMentorAssistant'

const riskLabel: Record<MentorMentee['risk'], string> = { ON_TRACK: 'On Track', AT_RISK: 'At Risk', NEEDS_ATTENTION: 'Needs Attention' }
const riskClass: Record<MentorMentee['risk'], string> = { ON_TRACK: 'bg-emerald-50 text-emerald-700', AT_RISK: 'bg-rose-50 text-rose-700', NEEDS_ATTENTION: 'bg-amber-50 text-amber-700' }
const goalStatus: Record<DevelopmentGoal['status'], string> = { NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', AT_RISK: 'At Risk' }

export function MentorPortal({ user }: { user: User }) {
  const [params, setParams] = useSearchParams()
  const view = params.get('view') || 'mentees'
  const setView = (next: string) => setParams(next === 'mentees' ? {} : { view: next })

  const [filter, setFilter] = useState<'ALL' | MentorMentee['risk']>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const menteesQuery = useQuery({ queryKey: ['mentor-mentees', user.id], queryFn: () => api.mentorMentees(user.id) })
  const waiversQuery = useQuery({ queryKey: ['waivers'], queryFn: api.waivers })
  const defensesQuery = useQuery({ queryKey: ['architect-defenses'], queryFn: () => api.architectDefenses() })

  const mentees = menteesQuery.data || []
  const filtered = useMemo(() => filter === 'ALL' ? mentees : mentees.filter((mentee) => mentee.risk === filter), [filter, mentees])
  const atRisk = mentees.filter((mentee) => mentee.risk === 'AT_RISK').length
  const attention = mentees.filter((mentee) => mentee.risk === 'NEEDS_ATTENTION').length
  const pending = (waiversQuery.data || []).filter((waiver) => waiver.status === 'PENDING_REVIEW').length

  const tabs = [
    { id: 'mentees', label: 'My Mentees', icon: UserRound },
    { id: 'ai-assistant', label: 'AI Mentor Assistant', badge: 'AI', icon: Sparkles },
    { id: 'requests', label: 'Mentee Requests', badge: '2', icon: CircleAlert },
    { id: 'plan', label: 'Development Plan', icon: ClipboardList },
    { id: 'pathway', label: 'Pathway Panel', badge: '1', icon: Route },
    { id: 'waivers', label: 'Waiver Recommendations', icon: ShieldCheck },
    { id: 'architect', label: 'Architect Board Panel', icon: Network },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {view === 'waivers' ? 'ACCELERATION GOVERNANCE' : 'MENTOR COMMAND CENTER'}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {view === 'mentees' && 'My Mentees'}
            {view === 'ai-assistant' && 'AI Mentor Assistant & Telemetry'}
            {view === 'requests' && 'Mentee Requests'}
            {view === 'plan' && 'Development Plans'}
            {view === 'pathway' && 'Pathway Selection Panel'}
            {view === 'waivers' && 'Waiver Recommendations'}
            {view === 'architect' && 'Architect Board Panel'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {view === 'waivers'
              ? 'Review and submit waiver recommendations for associates eligible to fast-track foundational modules.'
              : view === 'ai-assistant'
              ? 'AI-driven telemetry, automated 1:1 coaching briefs, and mentee risk notifications.'
              : 'A clear view of momentum, risk, and the decisions that keep your associates moving.'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="text-xs">
            <ClipboardList size={14} /> Weekly coaching rhythm
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              view === tab.id
                ? 'border-[#007df0] text-[#007df0]'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            <tab.icon size={14} className={view === tab.id ? 'text-[#007df0]' : 'text-slate-400'} />
            {tab.label}
            {tab.badge && (
              <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                view === tab.id ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* View: Mentees (Default) */}
      {view === 'mentees' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<UserRound size={17} />} value={String(mentees.length || 2)} label="Active mentees" detail="Assigned to you" tone="blue" />
            <Metric icon={<Target size={17} />} value={`${mentees.length ? Math.round(mentees.reduce((sum, mentee) => sum + mentee.readiness, 0) / mentees.length) : 78}%`} label="Portfolio readiness" detail="Across current journeys" tone="emerald" />
            <Metric icon={<CircleAlert size={17} />} value={String(atRisk + attention || 0)} label="Needs attention" detail={`${atRisk} at risk · ${attention} watch`} tone="amber" />
            <Metric icon={<ShieldCheck size={17} />} value={String(pending || 1)} label="Waiver reviews" detail="Awaiting your decision" tone="navy" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
            <Card>
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Portfolio signal</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Prioritize the next meaningful coaching conversation.</p>
                </div>
                <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/80">
                  {(['ALL', 'ON_TRACK', 'AT_RISK', 'NEEDS_ATTENTION'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setFilter(option)}
                      className={`rounded-md px-2.5 py-1 text-[10.5px] font-bold transition-all ${
                        filter === option ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {option === 'ALL' ? 'All' : riskLabel[option]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {menteesQuery.isLoading ? (
                  <div className="space-y-4 p-5">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                ) : (
                  filtered.map((mentee) => (
                    <MenteeRow key={mentee.id} mentee={mentee} onOpen={() => setSelectedId(mentee.id)} />
                  ))
                )}
                {!menteesQuery.isLoading && filtered.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-500">No mentees match this view.</div>
                )}
              </div>
            </Card>

            <div className="space-y-6">
              <WaiverQueue waivers={waiversQuery.data || []} mentorId={user.id} />
              <Card>
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-bold text-slate-900">Coaching cadence</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Keep the portfolio moving with small, timely actions.</p>
                </div>
                <div className="space-y-4 p-5">
                  <Cadence icon={<Flag size={14} />} title="2 check-ins due this week" detail="Ananya Rao · Fatima Sheikh" />
                  <Cadence icon={<Layers3 size={14} />} title="1 plan needs a refresh" detail="Fatima's Month 4 Gate 1 Fork goal" />
                  <Cadence icon={<ArrowUpRight size={14} />} title="Next portfolio review" detail="Friday, 22 August" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* View: Waiver Recommendations */}
      {view === 'waivers' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 shadow-2xs">
            <p>
              <strong>Waiver Rule.</strong> Associates scoring ≥ 80% on a WF assessment become eligible to waive corresponding foundational curriculum modules upon mentor recommendation and committee ratification.
            </p>
          </div>

          {/* Waiver Cards matching Screenshot 4 */}
          <div className="space-y-4">
            <Card className="p-6 border-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white shadow-sm">
                    FS
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Fatima Sheikh</h3>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300/60">
                        Recommended by you
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300/60">
                        pending
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Eligible Course: <strong className="text-slate-800">WF-101 Java 21 &amp; Secure AI Prompting</strong> · Current Milestone: <strong className="text-slate-800">Month 4 Gate 1 Fork</strong>
                    </p>
                    <p className="mt-3 text-xs text-slate-600 max-w-3xl leading-relaxed">
                      Fast-track candidate scoring 84% on WF-101 live assessment. Demonstrates senior-level mastery of modern Java concurrent models and secure AI prompting standards. Recommend waiving introductory modules and advancing immediately to Gate 1 Data Engineering pathway fork.
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Badge className="bg-emerald-50 text-emerald-700 text-center">Recommendation Submitted</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white shadow-sm">
                    AR
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Ananya Rao</h3>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300/60">
                        Approved by Committee
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Eligible Course: <strong className="text-slate-800">DATA-201 Advanced Distributed Systems</strong> · Current Milestone: <strong className="text-slate-800">ASM-104 RFC Defense</strong>
                    </p>
                    <p className="mt-3 text-xs text-slate-600 max-w-3xl leading-relaxed">
                      Accelerated candidate with perfect 96% score in distributed algorithms. Foundation modules successfully waived; credit ledger credited +25.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge className="bg-emerald-50 text-emerald-700">Waiver Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View: Mentee Requests */}
      {view === 'requests' && (
        <Card className="p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Pending Requests from Mentees</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900">Fatima Sheikh — Month 4 Gate 1 Pathway Approval</span>
                  <p className="text-xs text-slate-500 mt-1">Requested Data Engineering pathway ratification.</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="text-xs">Endorse Recommendation</Button>
                <Button variant="outline" className="text-xs">Provide Feedback</Button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900">Ananya Rao — Architect Board Schedule Confirmation</span>
                  <p className="text-xs text-slate-500 mt-1">RFC Document ready for Stream 04/05 defense review.</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="text-xs">Confirm Defense Slot</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* View: Development Plan */}
      {view === 'plan' && (
        <Card className="p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Portfolio Development Plans</h2>
          <p className="text-xs text-slate-500 mb-4">Track structured development goals across your mentee cohort.</p>
          <div className="space-y-3">
            {[
              { name: 'Fatima Sheikh', goal: 'Master Spark / Flink stream joins before Month 6 milestone', priority: 'High', month: 6, status: 'In Progress' },
              { name: 'Fatima Sheikh', goal: 'Complete AWS Certified Data Analytics Specialty', priority: 'Medium', month: 8, status: 'Not Started' },
              { name: 'Ananya Rao', goal: 'Author RFC on Payments Idempotency for Architect Board', priority: 'High', month: 12, status: 'In Progress' },
              { name: 'Ananya Rao', goal: 'Achieve P99 < 10ms in Kafka distributed benchmark', priority: 'High', month: 14, status: 'In Progress' },
            ].map((g, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{g.name}</span>
                    <Badge className="text-[10px]">{g.priority} Priority</Badge>
                    <span className="text-[11px] text-slate-400">Target Month {g.month}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{g.goal}</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700">{g.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* View: Pathway Panel */}
      {view === 'pathway' && (
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">GATE 1 → FORK</span>
              <h2 className="text-base font-bold text-slate-900">Pathway Recommendation &amp; Mentor Ratification</h2>
            </div>
            <Badge className="bg-amber-100 text-amber-800">1 Action Required</Badge>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Fatima Sheikh has completed Month 4 Gate 1 evaluation. Algorithmic scores (DE 25, SE 23, CSE 23, IE 22) and mentor evaluation point to <strong>Data Engineering (DE)</strong>.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-xs">
            <p className="font-bold text-blue-900">Your Mentor Assessment for Fatima:</p>
            <p className="text-blue-800 mt-1">
              "Strong algorithmic instincts; naturally gravitated to stream processing in the Week 6 distributed labs. DE is an outstanding fit for her capability profile."
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="text-xs bg-[#1e3a66] text-white">Ratify &amp; Offer DE Pathway</Button>
            <Button variant="outline" className="text-xs">Propose Alternative Track</Button>
          </div>
        </Card>
      )}

      {/* View: AI Mentor Assistant */}
      {view === 'ai-assistant' && (
        <AIMentorAssistant initialAssociateId="as-ananya" />
      )}

      {/* View: Architect Board Panel (Matching Screenshot 14) */}
      {view === 'architect' && (
        <ArchitectBoardPanel />
      )}

      {selectedId && <MenteeDrawer associateId={selectedId} mentorId={user.id} onClose={() => setSelectedId(null)} />}

      {/* Mockup footer metadata matching screenshot */}
      <div className="pt-6 text-[11px] text-slate-400 space-y-1">
        <p><strong>Program Deployment.</strong> Targeted for launch with the incoming global technology campus intake.</p>
        <p>Contact: Engineering Excellence Committee · technology.accelerator@wellsfargo.com</p>
        <p>ASCEND Mockup UI — data illustrative, sourced from the Graduate Developer Accelerator executive board proposal and the Advanced Systems Engineering / Agentic AI course outlines. Wire to LMS / Prometric / HRIS for production use.</p>
      </div>
    </div>
  )
}

function ArchitectBoardPanel() {
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

      {/* Panel Actions matching Screenshot 14 */}
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

function MenteeRow({ mentee, onOpen }: { mentee: MentorMentee; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0c1b33] text-xs font-bold text-white">
        {mentee.name.split(' ').map((name) => name[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-800">{mentee.name}</p>
          <Badge className={riskClass[mentee.risk]}>{riskLabel[mentee.risk]}</Badge>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400">{mentee.pathway_name} · Month {mentee.current_month} · {mentee.title}</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="w-28">
            <div className="mb-1 flex justify-between text-[9px] text-slate-400">
              <span>Readiness</span>
              <strong className="text-slate-600">{mentee.readiness}%</strong>
            </div>
            <ProgressBar value={mentee.readiness / 100} color={mentee.risk === 'AT_RISK' ? 'bg-rose-500' : 'bg-blue-500'} />
          </div>
          <div className="hidden text-[10px] text-slate-500 sm:block">
            Assessment <strong className="text-slate-700">{mentee.assessment_score}%</strong>
          </div>
          <div className="hidden text-[10px] text-slate-500 sm:block">
            ASM <strong className="text-slate-700">{mentee.asm_progress}%</strong>
          </div>
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Requests</p>
        <p className="mt-1 text-sm font-bold text-slate-800">{mentee.pending_requests || '—'}</p>
      </div>
      <ChevronRight size={17} className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
    </button>
  )
}

function MenteeDrawer({ associateId, mentorId, onClose }: { associateId: string; mentorId: string; onClose: () => void }) {
  const queryClient = useQueryClient()
  const profileQuery = useQuery({ queryKey: ['mentee-profile', associateId], queryFn: () => api.menteeProfile(associateId) })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [goal, setGoal] = useState({ goal: '', description: '', priority: 'Medium', target_month: 10, status: 'NOT_STARTED' as DevelopmentGoal['status'] })
  const createGoal = useMutation({
    mutationFn: () => api.createDevelopmentPlan({ associate_id: associateId, ...goal }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee-profile', associateId] })
      setGoal({ goal: '', description: '', priority: 'Medium', target_month: 10, status: 'NOT_STARTED' })
      setShowGoalForm(false)
    },
  })

  if (profileQuery.isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/30">
        <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white p-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-6 h-40" />
        </div>
      </div>
    )
  }

  const data = profileQuery.data
  if (!data) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto bg-slate-50 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <button onClick={onClose} className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900">
            <ArrowLeft size={15} />Back to portfolio
          </button>
          <button onClick={onClose} className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800">
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-5 md:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white">
              {data.profile.name.split(' ').map((name) => name[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Mentee profile</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">{data.profile.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{data.profile.title} · {data.profile.team_name}</p>
              <p className="mt-1 text-xs text-slate-400">{data.profile.email} · Cohort {data.profile.cohort}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Score label="Readiness" value={data.progress.overall} />
            <Score label="Assessment" value={data.progress.assessment} />
            <Score label="ASM progress" value={data.progress.asm} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle
                title="Development plan"
                action={
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setShowGoalForm(!showGoalForm)}>
                    {showGoalForm ? <X size={13} /> : <Plus size={13} />}{showGoalForm ? 'Cancel' : 'Add goal'}
                  </Button>
                }
              />
              {showGoalForm && (
                <form onSubmit={(event) => { event.preventDefault(); createGoal.mutate() }} className="space-y-3 border-b border-slate-100 p-4">
                  <input required value={goal.goal} onChange={(event) => setGoal({ ...goal, goal: event.target.value })} placeholder="Goal" className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400" />
                  <textarea required value={goal.description} onChange={(event) => setGoal({ ...goal, description: event.target.value })} placeholder="Description" rows={2} className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={goal.priority} onChange={(event) => setGoal({ ...goal, priority: event.target.value })} className="rounded-md border border-slate-200 px-3 py-2 text-xs">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <input type="number" min="1" max="24" value={goal.target_month} onChange={(event) => setGoal({ ...goal, target_month: Number(event.target.value) })} className="rounded-md border border-slate-200 px-3 py-2 text-xs" />
                  </div>
                  <Button type="submit" className="w-full" disabled={createGoal.isPending}>Save goal</Button>
                </form>
              )}
              <div className="divide-y divide-slate-100">
                {data.development_plan.map((item) => (
                  <GoalRow key={item.id} goal={item} />
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle title="Mentor notes" />
              <div className="space-y-4 p-4">
                {data.mentor_notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-blue-400 pl-3">
                    <p className="text-xs leading-5 text-slate-600">{note.text}</p>
                    <p className="mt-2 text-[10px] font-semibold text-slate-400">{note.author} · {note.created_at}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </aside>
    </div>
  )
}

function WaiverQueue({ waivers, mentorId }: { waivers: Waiver[]; mentorId: string }) {
  const queryClient = useQueryClient()
  const review = useMutation({
    mutationFn: ({ id, recommendation }: { id: string; recommendation: 'RECOMMEND' | 'DO_NOT_RECOMMEND' }) => api.reviewWaiver(id, mentorId, recommendation),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waivers'] }),
  })

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Waiver decisions</h2>
          <p className="mt-0.5 text-xs text-slate-400">System suggestions always wait for mentor review.</p>
        </div>
        <ShieldCheck size={17} className="text-blue-500" />
      </div>
      <div className="divide-y divide-slate-100">
        {waivers.map((waiver) => (
          <div key={waiver.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">{waiver.associate}</p>
                <p className="mt-1 text-[10px] text-slate-500">{waiver.current_milestone} → {waiver.eligible_course}</p>
              </div>
              <Badge className={waiver.status === 'PENDING_REVIEW' ? 'bg-amber-50 text-amber-700' : waiver.status === 'MENTOR_RECOMMENDED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                {waiver.status === 'PENDING_REVIEW' ? 'Review' : waiver.status.replace('MENTOR_', '').replace('_', ' ')}
              </Badge>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-500">{waiver.reason}</p>
            {waiver.status === 'PENDING_REVIEW' && (
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 px-2 py-1.5 text-[11px]" onClick={() => review.mutate({ id: waiver.id, recommendation: 'RECOMMEND' })} disabled={review.isPending}>
                  <Check size={13} />Recommend
                </Button>
                <Button variant="outline" className="flex-1 px-2 py-1.5 text-[11px]" onClick={() => review.mutate({ id: waiver.id, recommendation: 'DO_NOT_RECOMMEND' })} disabled={review.isPending}>
                  Do not recommend
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

function Metric({ icon, value, label, detail, tone }: { icon: ReactNode; value: string; label: string; detail: string; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', navy: 'bg-slate-100 text-slate-700' }
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-md ${tones[tone]}`}>{icon}</div>
        <div>
          <p className="text-xl font-bold text-slate-950">{value}</p>
          <p className="text-[11px] font-semibold text-slate-700">{label}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">{detail}</p>
        </div>
      </div>
    </Card>
  )
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-950">{value}%</p>
        <span className="text-[10px] font-semibold text-emerald-600">signal</span>
      </div>
      <ProgressBar value={value / 100} className="mt-3" color="bg-blue-500" />
    </Card>
  )
}

function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><h3 className="text-xs font-bold text-slate-900">{title}</h3>{action}</div>
}

function GoalRow({ goal }: { goal: DevelopmentGoal }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800">{goal.goal}</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">{goal.description}</p>
        </div>
        <Badge className={goal.status === 'AT_RISK' ? 'bg-rose-50 text-rose-700' : goal.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}>
          {goalStatus[goal.status]}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-400">
        <span className="font-bold text-slate-600">{goal.priority} priority</span>
        <span>Target month {goal.target_month}</span>
      </div>
    </div>
  )
}

function Cadence({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-800">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
      </div>
    </div>
  )
}
