import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, ArrowRight, BarChart3, Brain, CheckCircle2, ChevronRight,
  Clock3, Cpu, Database, FileCheck, Gavel, History, Lightbulb,
  Network, Scale, Shield, ShieldCheck, Sparkles, TrendingUp, User, Users,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { AlignmentState, CommitteeStatus, MentorReview, PathwayRecommendation, PathwayScore } from '../types'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'
import { cn } from '../lib/utils'

const PATHWAY_META: Record<string, { icon: typeof Database; color: string; bg: string; text: string; ring: string }> = {
  DE: { icon: Database, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
  SE: { icon: Cpu, color: 'bg-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600', ring: 'ring-cyan-200' },
  CSE: { icon: Shield, color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
  IE: { icon: Network, color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
}

const ALIGNMENT_META: Record<AlignmentState, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  ALIGNED: { label: 'Aligned', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
  PARTIALLY_ALIGNED: { label: 'Partially Aligned', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Scale },
  DIVERGENT: { label: 'Divergent', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  PENDING: { label: 'Pending', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Clock3 },
}

interface Props { associateId: string }

export function PathwaySelection({ associateId }: Props) {
  const queryClient = useQueryClient()
  const [showMentorForm, setShowMentorForm] = useState(false)
  const [showCommitteeForm, setShowCommitteeForm] = useState(false)

  const recQuery = useQuery({
    queryKey: ['pathway-recommendation', associateId],
    queryFn: () => api.pathwayRecommendation(associateId),
  })

  const historyQuery = useQuery({
    queryKey: ['pathway-history', associateId],
    queryFn: () => api.pathwayHistory(associateId),
  })

  const mentorMutation = useMutation({
    mutationFn: (review: Parameters<typeof api.submitMentorReview>[0]) => api.submitMentorReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pathway-recommendation', associateId] })
      setShowMentorForm(false)
    },
  })

  const committeeMutation = useMutation({
    mutationFn: (decision: Parameters<typeof api.submitCommitteeDecision>[0]) => api.submitCommitteeDecision(decision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pathway-history', associateId] })
      queryClient.invalidateQueries({ queryKey: ['pathway-recommendation', associateId] })
      setShowCommitteeForm(false)
    },
  })

  if (recQuery.isLoading) return <SelectionSkeleton />
  if (recQuery.isError || !recQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={32} className="text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">Unable to load pathway recommendation.</p>
        <Button className="mt-4" variant="outline" onClick={() => recQuery.refetch()}>Retry</Button>
      </div>
    )
  }

  const rec = recQuery.data
  const alignment = rec.reconciliation.alignment
  const alignMeta = ALIGNMENT_META[alignment]
  const isDivergent = alignment === 'DIVERGENT'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0c1b33] text-white shadow-lg">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Pathway Selection & Recommendation Engine</h1>
            <p className="mt-0.5 text-xs text-slate-500">Algorithmic recommendation · Mentor judgment · Committee governance</p>
          </div>
        </div>
      </motion.div>

      {/* Associate summary bar */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c1b33] text-sm font-bold text-white">
              {rec.associate_name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{rec.associate_name}</p>
              <p className="text-xs text-slate-500">Associate ID: {rec.associate_id}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-slate-100 text-slate-600"><User size={11} className="mr-1" />Associate</Badge>
            <Badge className="bg-blue-50 text-blue-600"><BarChart3 size={11} className="mr-1" />Assessment Performance</Badge>
            <Badge className="bg-cyan-50 text-cyan-700"><Sparkles size={11} className="mr-1" />Algorithmic Recommendation</Badge>
          </div>
        </div>
      </Card>

      {/* Ranked pathways — horizontal ranking visualization */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={17} className="text-blue-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ranked Pathways</h2>
              <p className="mt-0.5 text-xs text-slate-400">Weighted scoring across assessment domains</p>
            </div>
          </div>
          <Badge className="bg-slate-100 text-slate-500">{rec.ranked_pathways.length} Pathways</Badge>
        </div>
        <div className="space-y-4 p-5">
          {rec.ranked_pathways.map((ps, i) => (
            <PathwayRankRow key={ps.pathway_code} score={ps} index={i} isTop={i === 0} />
          ))}
        </div>
      </Card>

      {/* System recommendation + contributing skills */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-cyan-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Algorithmic Recommendation</h2>
                <p className="mt-0.5 text-xs text-slate-400">Transparent weighted scoring breakdown</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <SystemRecommendationCard score={rec.system_recommendation} />
            <div className="mt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Contributing Skills</p>
              <div className="space-y-2.5">
                {rec.system_recommendation.contributing_skills.map((skill) => (
                  <div key={skill.skill} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-xs font-semibold text-slate-700">{skill.skill}</div>
                    <div className="flex-1">
                      <ProgressBar value={skill.percentage / 100} color="bg-blue-500" className="h-2" />
                    </div>
                    <div className="w-16 shrink-0 text-right">
                      <span className="text-xs font-bold text-slate-700">{skill.percentage}%</span>
                    </div>
                    <div className="hidden w-12 shrink-0 text-right text-[10px] text-slate-400 sm:block">
                      w:{skill.weight.toFixed(1)}
                    </div>
                    <div className="hidden w-16 shrink-0 text-right text-[10px] font-semibold text-cyan-700 md:block">
                      +{skill.contribution.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Assessment performance */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={17} className="text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Assessment Performance</h2>
                <p className="mt-0.5 text-xs text-slate-400">Input data for scoring</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {rec.assessment_performance.map((a) => (
              <div key={a.assessment_id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{a.assessment_title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{a.domain}</p>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  {a.score !== null && a.score !== undefined ? (
                    <>
                      <p className={cn('text-sm font-bold', a.score >= 80 ? 'text-emerald-600' : a.score >= 70 ? 'text-blue-600' : 'text-amber-600')}>{a.score}%</p>
                      <p className="text-[10px] text-slate-400">{a.status}</p>
                    </>
                  ) : (
                    <Badge className={cn('text-[10px]', a.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500')}>{a.status.replace('_', ' ')}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reconciliation */}
      <Card className={cn('overflow-hidden', isDivergent && 'ring-2 ring-red-200')}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Scale size={17} className="text-blue-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recommendation Reconciliation</h2>
              <p className="mt-0.5 text-xs text-slate-400">System vs. Mentor alignment</p>
            </div>
          </div>
          <div className={cn('flex items-center gap-1.5 rounded-full border px-3 py-1.5', alignMeta.bg, alignMeta.border)}>
            <alignMeta.icon size={14} className={alignMeta.color} />
            <span className={cn('text-xs font-bold', alignMeta.color)}>{alignMeta.label}</span>
          </div>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <RecoColumn
            icon={<Sparkles size={16} />}
            label="System Recommendation"
            value={rec.system_recommendation.pathway_code}
            name={rec.system_recommendation.pathway_name}
            confidence={rec.system_recommendation.confidence}
            tone="cyan"
          />
          <RecoColumn
            icon={<User size={16} />}
            label="Mentor Recommendation"
            value={rec.mentor_review?.recommended_pathway || '—'}
            name={rec.mentor_review ? PATHWAY_NAMES[rec.mentor_review.recommended_pathway] || '—' : 'Not yet submitted'}
            confidence={rec.mentor_review?.confidence}
            tone="blue"
          />
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Scale size={16} />
              <p className="text-[11px] font-bold uppercase tracking-wider">Alignment</p>
            </div>
            <p className={cn('mt-2 text-lg font-bold', alignMeta.color)}>{alignMeta.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{rec.reconciliation.reason}</p>
          </div>
        </div>
        {isDivergent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <div className="mx-5 mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-800">Human Review Required</p>
                <p className="mt-0.5 text-xs leading-relaxed text-red-600">
                  The algorithmic and mentor recommendations diverge significantly. A committee review must be conducted
                  before a final pathway decision is confirmed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Mentor input + Committee decision */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mentor */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users size={17} className="text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Mentor Recommendation</h2>
                <p className="mt-0.5 text-xs text-slate-400">Independent human judgment</p>
              </div>
            </div>
            {!rec.mentor_review && !showMentorForm && (
              <Button variant="outline" onClick={() => setShowMentorForm(true)}>Add Review</Button>
            )}
          </div>
          <div className="p-5">
            <AnimatePresence mode="wait">
              {showMentorForm ? (
                <MentorForm
                  associateId={associateId}
                  onSubmit={(data) => mentorMutation.mutate(data)}
                  onCancel={() => setShowMentorForm(false)}
                  isLoading={mentorMutation.isPending}
                />
              ) : rec.mentor_review ? (
                <MentorReviewDisplay review={rec.mentor_review} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users size={28} className="text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-500">No mentor review submitted yet</p>
                  <p className="mt-1 text-xs text-slate-400">The mentor provides an independent pathway recommendation.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Committee */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Gavel size={17} className="text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Committee Decision</h2>
                <p className="mt-0.5 text-xs text-slate-400">Governance approval</p>
              </div>
            </div>
            {!showCommitteeForm && (
              <Button variant="outline" onClick={() => setShowCommitteeForm(true)}>Record Decision</Button>
            )}
          </div>
          <div className="p-5">
            <AnimatePresence mode="wait">
              {showCommitteeForm ? (
                <CommitteeForm
                  associateId={associateId}
                  systemRec={rec.system_recommendation.pathway_code}
                  mentorRec={rec.mentor_review?.recommended_pathway || ''}
                  onSubmit={(data) => committeeMutation.mutate(data)}
                  onCancel={() => setShowCommitteeForm(false)}
                  isLoading={committeeMutation.isPending}
                />
              ) : historyQuery.data && historyQuery.data.length > 0 ? (
                <CommitteeHistoryView entries={historyQuery.data} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Gavel size={28} className="text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-500">No committee decisions recorded</p>
                  <p className="mt-1 text-xs text-slate-400">The committee confirms, overrides, or requests review.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Decision timeline */}
      {historyQuery.data && historyQuery.data.length > 0 && !showCommitteeForm && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <History size={17} className="text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Decision Timeline</h2>
                <p className="mt-0.5 text-xs text-slate-400">Full audit trail of pathway decisions</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-0">
              {historyQuery.data.map((entry, i) => (
                <TimelineEntry key={entry.id} entry={entry} isLast={i === historyQuery.data.length - 1} />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Governance rule banner */}
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-5 py-4">
        <ShieldCheck size={20} className="shrink-0 text-slate-400" />
        <p className="text-xs leading-relaxed text-slate-500">
          <span className="font-bold text-slate-700">Governance Rule:</span> The algorithm never makes the final decision.
          The system recommendation is advisory. The mentor provides human judgment. The committee provides governance approval.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pathway rank row — horizontal bar visualization
// ---------------------------------------------------------------------------

function PathwayRankRow({ score, index, isTop }: { score: PathwayScore; index: number; isTop: boolean }) {
  const meta = PATHWAY_META[score.pathway_code] || PATHWAY_META.DE
  const Icon = meta.icon
  const maxScore = 100
  const widthPct = (score.normalized_score / maxScore) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn('relative overflow-hidden rounded-lg border transition-all', isTop ? 'border-slate-300 bg-slate-50/60' : 'border-slate-200 bg-white')}
    >
      {/* Rank badge */}
      <div className="flex items-stretch">
        <div className={cn('flex w-12 shrink-0 items-center justify-center', isTop ? 'bg-[#0c1b33]' : 'bg-slate-100')}>
          <span className={cn('text-lg font-black', isTop ? 'text-white' : 'text-slate-400')}>{score.rank}</span>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', meta.bg)}>
                <Icon size={18} className={meta.text} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{score.pathway_name}</p>
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold', meta.bg, meta.text)}>{score.pathway_code}</span>
                  {isTop && <Badge className="bg-cyan-100 text-cyan-700"><Sparkles size={9} className="mr-0.5" />RECOMMENDED</Badge>}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">Confidence: {(score.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black tracking-tight text-slate-900">{score.normalized_score.toFixed(0)}</p>
              <p className="text-[10px] text-slate-400">Score</p>
            </div>
          </div>
          {/* Horizontal bar */}
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${widthPct}%` }}
              transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
              className={cn('h-full rounded-full', meta.color)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// System recommendation card
// ---------------------------------------------------------------------------

function SystemRecommendationCard({ score }: { score: PathwayScore }) {
  const meta = PATHWAY_META[score.pathway_code] || PATHWAY_META.DE
  const Icon = meta.icon
  return (
    <div className={cn('flex items-center gap-4 rounded-lg border p-4', meta.bg, meta.ring, 'ring-1')}>
      <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm', meta.text)}>
        <Icon size={26} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recommended Pathway</p>
        <p className="text-lg font-bold text-slate-900">{score.pathway_name}</p>
        <p className="text-xs text-slate-500">Score {score.normalized_score.toFixed(1)} · Confidence {(score.confidence * 100).toFixed(0)}%</p>
      </div>
      <div className="text-right">
        <p className={cn('text-3xl font-black', meta.text)}>#{score.rank}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reconciliation column
// ---------------------------------------------------------------------------

function RecoColumn({ icon, label, value, name, confidence, tone }: {
  icon: React.ReactNode; label: string; value: string; name: string; confidence?: number; tone: string
}) {
  const tones: Record<string, string> = {
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return (
    <div className={cn('rounded-lg border p-4', tones[tone])}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{name}</p>
      {confidence !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={confidence} color="bg-blue-500" className="h-1.5 flex-1" />
          <span className="text-[10px] font-semibold text-slate-500">{(confidence * 100).toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mentor form
// ---------------------------------------------------------------------------

function MentorForm({ associateId, onSubmit, onCancel, isLoading }: {
  associateId: string
  onSubmit: (data: Parameters<typeof api.submitMentorReview>[0]) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [pathway, setPathway] = useState('DE')
  const [confidence, setConfidence] = useState(0.75)
  const [strengths, setStrengths] = useState('')
  const [concerns, setConcerns] = useState('')
  const [comments, setComments] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Recommended Pathway</label>
        <div className="grid grid-cols-2 gap-2">
          {(['DE', 'SE', 'CSE', 'IE'] as const).map((code) => {
            const meta = PATHWAY_META[code]
            const Icon = meta.icon
            return (
              <button
                key={code}
                onClick={() => setPathway(code)}
                className={cn('flex items-center gap-2 rounded-lg border p-3 text-left transition-all', pathway === code ? cn('border-2', meta.bg, meta.ring, 'ring-1') : 'border-slate-200 hover:border-slate-300')}
              >
                <Icon size={16} className={meta.text} />
                <div>
                  <p className="text-xs font-bold text-slate-800">{code}</p>
                  <p className="text-[10px] text-slate-400">{PATHWAY_NAMES[code]}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Confidence: {(confidence * 100).toFixed(0)}%</label>
        <input type="range" min={0} max={1} step={0.05} value={confidence} onChange={(e) => setConfidence(parseFloat(e.target.value))} className="w-full accent-blue-600" />
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Strengths</label>
        <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} placeholder="Key strengths observed..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200" />
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Concerns</label>
        <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} rows={2} placeholder="Areas of concern..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200" />
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Comments</label>
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={2} placeholder="Additional context..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ associate_id: associateId, mentor_id: 'u-karthik', mentor_name: 'Karthik Iyer', recommended_pathway: pathway, confidence, strengths, concerns, comments })} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Review'}
          {!isLoading && <ArrowRight size={14} />}
        </Button>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Mentor review display
// ---------------------------------------------------------------------------

function MentorReviewDisplay({ review }: { review: MentorReview }) {
  const meta = PATHWAY_META[review.recommended_pathway] || PATHWAY_META.DE
  const Icon = meta.icon
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className={cn('flex items-center gap-4 rounded-lg border p-4', meta.bg, meta.ring, 'ring-1')}>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm', meta.text)}>
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mentor's Recommended Pathway</p>
          <p className="text-base font-bold text-slate-900">{PATHWAY_NAMES[review.recommended_pathway] || review.recommended_pathway}</p>
          <p className="text-xs text-slate-500">by {review.mentor_name}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-slate-900">{(review.confidence * 100).toFixed(0)}%</p>
          <p className="text-[10px] text-slate-400">Confidence</p>
        </div>
      </div>
      {review.strengths && <ReviewField icon={<TrendingUp size={14} />} label="Strengths" value={review.strengths} tone="emerald" />}
      {review.concerns && <ReviewField icon={<AlertTriangle size={14} />} label="Concerns" value={review.concerns} tone="amber" />}
      {review.comments && <ReviewField icon={<Lightbulb size={14} />} label="Comments" value={review.comments} tone="slate" />}
    </motion.div>
  )
}

function ReviewField({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <div className="flex gap-3">
      <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', tones[tone])}>{icon}</div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{value}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Committee form
// ---------------------------------------------------------------------------

function CommitteeForm({ associateId, systemRec, mentorRec, onSubmit, onCancel, isLoading }: {
  associateId: string
  systemRec: string
  mentorRec: string
  onSubmit: (data: Parameters<typeof api.submitCommitteeDecision>[0]) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [decision, setDecision] = useState<CommitteeStatus>('CONFIRMED')
  const [finalPathway, setFinalPathway] = useState(systemRec)
  const [reason, setReason] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {([
          { value: 'CONFIRMED', label: 'Confirm', icon: CheckCircle2, tone: 'emerald' },
          { value: 'OVERRIDE', label: 'Override', icon: Gavel, tone: 'amber' },
          { value: 'REQUEST_REVIEW', label: 'Request Review', icon: FileCheck, tone: 'blue' },
        ] as const).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDecision(opt.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all',
              decision === opt.value
                ? opt.tone === 'emerald' ? 'border-emerald-300 bg-emerald-50' : opt.tone === 'amber' ? 'border-amber-300 bg-amber-50' : 'border-blue-300 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <opt.icon size={18} className={opt.tone === 'emerald' ? 'text-emerald-600' : opt.tone === 'amber' ? 'text-amber-600' : 'text-blue-600'} />
            <span className="text-[11px] font-bold text-slate-700">{opt.label}</span>
          </button>
        ))}
      </div>

      {decision === 'OVERRIDE' && (
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Override Pathway</label>
          <div className="grid grid-cols-4 gap-2">
            {(['DE', 'SE', 'CSE', 'IE'] as const).map((code) => {
              const meta = PATHWAY_META[code]
              const Icon = meta.icon
              return (
                <button
                  key={code}
                  onClick={() => setFinalPathway(code)}
                  className={cn('flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-all', finalPathway === code ? cn('border-2', meta.bg) : 'border-slate-200 hover:border-slate-300')}
                >
                  <Icon size={16} className={meta.text} />
                  <span className="text-[10px] font-bold text-slate-700">{code}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Reason</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Provide governance rationale for this decision..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSubmit({ associate_id: associateId, system_recommendation: systemRec, mentor_recommendation: mentorRec, committee_decision: decision === 'OVERRIDE' ? finalPathway : decision, reason, status: decision })}
          disabled={isLoading}
        >
          {isLoading ? 'Recording...' : 'Record Decision'}
          {!isLoading && <ChevronRight size={14} />}
        </Button>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Committee history view (compact)
// ---------------------------------------------------------------------------

function CommitteeHistoryView({ entries }: { entries: import('../types').PathwayHistoryEntry[] }) {
  const latest = entries[0]
  const statusMeta: Record<string, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
    OVERRIDE: { label: 'Overridden', bg: 'bg-amber-50', text: 'text-amber-600', icon: Gavel },
    REQUEST_REVIEW: { label: 'Review Requested', bg: 'bg-blue-50', text: 'text-blue-600', icon: FileCheck },
  }
  const meta = statusMeta[latest.status] || statusMeta.CONFIRMED
  const Icon = meta.icon
  return (
    <div className="space-y-3">
      <div className={cn('flex items-center gap-3 rounded-lg border p-4', meta.bg, 'border-slate-200')}>
        <Icon size={20} className={meta.text} />
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">{meta.label}</p>
          <p className="text-xs text-slate-500">{latest.committee_decision} · {new Date(latest.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
      {latest.reason && (
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reason</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{latest.reason}</p>
        </div>
      )}
      <p className="text-center text-[11px] text-slate-400">{entries.length} decision{entries.length > 1 ? 's' : ''} recorded</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline entry
// ---------------------------------------------------------------------------

function TimelineEntry({ entry, isLast }: { entry: import('../types').PathwayHistoryEntry; isLast: boolean }) {
  const statusMeta: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
    OVERRIDE: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Gavel },
    REQUEST_REVIEW: { bg: 'bg-blue-50', text: 'text-blue-600', icon: FileCheck },
  }
  const meta = statusMeta[entry.status] || statusMeta.CONFIRMED
  const Icon = meta.icon
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', meta.bg)}>
          <Icon size={16} className={meta.text} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200" />}
      </div>
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">{entry.committee_decision}</p>
          <p className="text-[11px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
          <span className="rounded bg-cyan-50 px-1.5 py-0.5 font-semibold text-cyan-700">System: {entry.system_recommendation}</span>
          {entry.mentor_recommendation && <span className="rounded bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-600">Mentor: {entry.mentor_recommendation}</span>}
        </div>
        {entry.reason && <p className="mt-2 text-xs leading-relaxed text-slate-600">{entry.reason}</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function SelectionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-80" />
      <Skeleton className="h-20" />
      <Skeleton className="h-80" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48" />
    </div>
  )
}

const PATHWAY_NAMES: Record<string, string> = {
  DE: 'Data Engineering',
  SE: 'Software Engineering',
  CSE: 'Cyber Security Engineering',
  IE: 'Infrastructure Engineering',
}
