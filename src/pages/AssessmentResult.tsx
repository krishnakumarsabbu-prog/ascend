import { motion } from 'framer-motion'
import { TriangleAlert as AlertTriangle, ArrowRight, Award, ChartBar as BarChart3, BookOpen, CircleCheck as CheckCircle2, ChevronRight, Clock3, Chrome as Home, Lightbulb, Target, TrendingDown, TrendingUp, Circle as XCircle } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { AttemptResult, DomainScore, TierPerformance } from '../types'
import { api } from '../lib/api'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'
import { cn } from '../lib/utils'

export function AssessmentResult() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const passedResult = (location.state as { result?: AttemptResult } | null)?.result

  const resultQuery = useQuery({
    queryKey: ['assessment-result', attemptId],
    queryFn: () => api.getAssessmentResult(attemptId!),
    enabled: Boolean(attemptId) && !passedResult,
  })

  const result = passedResult || resultQuery.data

  if (resultQuery.isLoading && !result) return <ResultSkeleton />
  if (resultQuery.isError || !result) {
    return <div className="flex flex-col items-center justify-center py-20 text-center"><AlertTriangle size={32} className="text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-500">Unable to load the assessment result.</p><Button className="mt-4" variant="outline" onClick={() => navigate('/curriculum')}>Back to Curriculum</Button></div>
  }

  const passed = result.passed
  const scoreColor = passed ? 'text-emerald-600' : 'text-amber-600'

  return <div className="space-y-6">
    {/* Hero result card */}
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn('overflow-hidden', passed && 'ring-1 ring-emerald-200')}>
        <div className={cn('flex flex-col items-center px-6 py-10 text-center md:px-12', passed ? 'bg-gradient-to-br from-emerald-50 to-white' : 'bg-gradient-to-br from-amber-50 to-white')}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring' }} className={cn('flex h-20 w-20 items-center justify-center rounded-full', passed ? 'bg-emerald-100' : 'bg-amber-100')}>
            {passed ? <Award size={40} className="text-emerald-600" /> : <Target size={40} className="text-amber-600" />}
          </motion.div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Completed</p>
          <h1 className={cn('mt-2 text-3xl font-bold tracking-tight md:text-4xl', passed ? 'text-emerald-700' : 'text-amber-700')}>{passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}</h1>
          <p className="mt-2 text-sm text-slate-500">{result.course_code} · {result.course_name}</p>

          <div className="mt-8 flex items-center gap-8">
            <div className="text-center">
              <p className={cn('text-5xl font-black tracking-tight', scoreColor)}>{result.score}<span className="text-2xl">%</span></p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">Overall Score</p>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-700">{result.passing_score}%</p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">Passing Score</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Badge className={passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}><span className={cn('mr-1 h-1.5 w-1.5 rounded-full', passed ? 'bg-emerald-500' : 'bg-amber-500')} />{result.gate_status}</Badge>
            <Badge className="bg-slate-100 text-slate-600">{result.total_questions} Questions</Badge>
          </div>
        </div>
      </Card>
    </motion.div>

    {/* Summary stats */}
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard icon={<CheckCircle2 size={20} />} value={result.correct} label="Correct" tone="emerald" />
      <StatCard icon={<XCircle size={20} />} value={result.incorrect} label="Incorrect" tone="red" />
      <StatCard icon={<Clock3 size={20} />} value={result.skipped} label="Skipped" tone="slate" />
    </div>

    {/* Domain performance */}
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2"><BarChart3 size={17} className="text-blue-500" /><div><h2 className="text-sm font-bold text-slate-900">Domain Performance</h2><p className="mt-0.5 text-xs text-slate-400">Score breakdown by knowledge domain</p></div></div>
      </div>
      <div className="space-y-5 p-5">
        {result.domain_scores.map((d, i) => <DomainRow key={d.domain} domain={d} index={i} />)}
      </div>
    </Card>

    {/* Tier performance */}
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2"><Target size={17} className="text-blue-500" /><div><h2 className="text-sm font-bold text-slate-900">Tier Performance</h2><p className="mt-0.5 text-xs text-slate-400">Difficulty progression across assessment tiers</p></div></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/60 text-[10px] uppercase tracking-wider text-slate-400">
            <tr><th className="px-5 py-3 font-semibold">Tier</th><th className="px-5 py-3 text-center font-semibold">Total</th><th className="px-5 py-3 text-center font-semibold">Correct</th><th className="px-5 py-3 text-center font-semibold">Incorrect</th><th className="px-5 py-3 text-center font-semibold">Skipped</th><th className="px-5 py-3 text-right font-semibold">Score</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.tier_performance.map((t) => <TierRow key={t.tier} tier={t} />)}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Performance insights */}
    <div className="grid gap-4 md:grid-cols-3">
      <InsightCard icon={<TrendingUp size={18} />} title="Strongest Area" value={result.insights.strongest_area} tone="emerald" />
      <InsightCard icon={<TrendingDown size={18} />} title="Improvement Area" value={result.insights.improvement_area} tone="amber" />
      <InsightCard icon={<Lightbulb size={18} />} title="Recommended Next Action" value={result.insights.recommended_next_action} tone="blue" />
    </div>

    {/* Actions */}
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button variant="outline" onClick={() => navigate('/curriculum')}><BookOpen size={15} />Back to Curriculum</Button>
      <Button variant="outline" onClick={() => navigate('/')}><Home size={15} />Go to Dashboard</Button>
      <Button onClick={() => navigate(`/assessment/${result.course_id}`)}><ArrowRight size={15} />Retake Assessment</Button>
    </div>
  </div>
}

function StatCard({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: string }) {
  const tones: Record<string, string> = { emerald: 'bg-emerald-50 text-emerald-600', red: 'bg-red-50 text-red-600', slate: 'bg-slate-100 text-slate-600' }
  return <Card className="p-5"><div className="flex items-center gap-4"><div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', tones[tone])}>{icon}</div><div><p className="text-2xl font-bold text-slate-950">{value}</p><p className="text-xs font-medium text-slate-500">{label}</p></div></div></Card>
}

function DomainRow({ domain, index }: { domain: DomainScore; index: number }) {
  const color = domain.percentage >= 80 ? 'bg-emerald-500' : domain.percentage >= 60 ? 'bg-blue-500' : domain.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
  return <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}>
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-800">{domain.domain}</span><Badge className="bg-slate-100 text-slate-500">{domain.correct}/{domain.total}</Badge></div>
      <span className="text-sm font-bold text-slate-700">{domain.percentage}%</span>
    </div>
    <ProgressBar value={domain.percentage / 100} color={color} className="h-2" />
    <div className="mt-1.5 flex gap-4 text-[10px] text-slate-400"><span className="text-emerald-600">{domain.correct} correct</span><span className="text-red-500">{domain.incorrect} incorrect</span><span className="text-slate-400">{domain.skipped} skipped</span></div>
  </motion.div>
}

function TierRow({ tier }: { tier: TierPerformance }) {
  const color = tier.percentage >= 80 ? 'text-emerald-600' : tier.percentage >= 60 ? 'text-blue-600' : tier.percentage >= 40 ? 'text-amber-600' : 'text-red-600'
  return <tr className="transition-colors hover:bg-slate-50">
    <td className="px-5 py-3.5 font-bold text-slate-800">{tier.tier}</td>
    <td className="px-5 py-3.5 text-center text-slate-500">{tier.total}</td>
    <td className="px-5 py-3.5 text-center font-semibold text-emerald-600">{tier.correct}</td>
    <td className="px-5 py-3.5 text-center font-semibold text-red-500">{tier.incorrect}</td>
    <td className="px-5 py-3.5 text-center text-slate-400">{tier.skipped}</td>
    <td className={cn('px-5 py-3.5 text-right font-bold', color)}>{tier.percentage}%</td>
  </tr>
}

function InsightCard({ icon, title, value, tone }: { icon: React.ReactNode; title: string; value: string; tone: string }) {
  const tones: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  }
  const t = tones[tone]
  return <Card className={cn('p-5', t.border, 'border-t-2')}>
    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', t.bg, t.text)}>{icon}</div>
    <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
    <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-800">{value}</p>
  </Card>
}

function ResultSkeleton() {
  return <div className="space-y-6"><Skeleton className="h-72" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div><Skeleton className="h-64" /></div>
}
