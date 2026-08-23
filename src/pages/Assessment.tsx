import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert as AlertCircle, ArrowLeft, ArrowRight, BookOpen, CircleCheck as CheckCircle2, Clock3, Flag, Loader as Loader2, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AttemptSummary, CurriculumCourse, Question } from '../types'
import { api } from '../lib/api'
import { Badge, Button, Card, ProgressBar, Skeleton } from '../components/ui'
import { cn, percent } from '../lib/utils'

type QState = 'unanswered' | 'answered' | 'marked' | 'current'

export function Assessment() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const courseQuery = useQuery({ queryKey: ['curriculum-course', courseId], queryFn: () => api.curriculumCourse(courseId!), enabled: Boolean(courseId) })
  const questionsQuery = useQuery({ queryKey: ['course-questions', courseId], queryFn: () => api.courseQuestions(courseId!), enabled: Boolean(courseId) })

  const [attempt, setAttempt] = useState<AttemptSummary | null>(null)
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef<number>(0)

  const course = courseQuery.data
  const questions = questionsQuery.data as Question[] | undefined

  // Start attempt when questions are loaded
  useEffect(() => {
    if (questions && !attempt && !starting && !startError) {
      setStarting(true)
      api.startAssessment(courseId!, 'as-ananya')
        .then((summary) => { setAttempt(summary); startTimeRef.current = Date.now(); })
        .catch(() => setStartError('Unable to start the assessment. Please try again.'))
        .finally(() => setStarting(false))
    }
  }, [questions, attempt, starting, startError, courseId])

  // Sync current question state from attempt
  useEffect(() => {
    if (attempt && questions) {
      const q = questions[currentIndex]
      if (q) setSelectedOption(attempt.answers[q.id] ?? null)
    }
  }, [attempt, currentIndex, questions])

  // Timer
  useEffect(() => {
    if (!attempt) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [attempt])

  const timeRemaining = useMemo(() => {
    if (!attempt) return 0
    return Math.max(0, attempt.time_limit_minutes * 60 - elapsed)
  }, [attempt, elapsed])

  const timeFormatted = useMemo(() => {
    const m = Math.floor(timeRemaining / 60)
    const s = timeRemaining % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [timeRemaining])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && attempt && !submitting) {
      handleSubmit()
    }
  }, [timeRemaining])

  const currentQuestion = questions?.[currentIndex]

  const questionStates = useMemo(() => {
    if (!attempt || !questions) return [] as QState[]
    return questions.map((q, i) => {
      const isCurrent = i === currentIndex
      const isMarked = attempt.marked.includes(q.id)
      const isAnswered = Boolean(attempt.answers[q.id])
      if (isCurrent) return 'current'
      if (isMarked) return 'marked'
      if (isAnswered) return 'answered'
      return 'unanswered'
    })
  }, [attempt, questions, currentIndex])

  const answeredCount = attempt?.answered ?? 0
  const markedCount = attempt?.marked_for_review ?? 0
  const totalQs = attempt?.total_questions ?? questions?.length ?? 0
  const progressValue = totalQs > 0 ? answeredCount / totalQs : 0

  const handleSelectOption = useCallback(async (optionId: string) => {
    if (!attempt || !currentQuestion) return
    setSelectedOption(optionId)
    try {
      const updated = await api.saveAnswer(attempt.id, currentQuestion.id, optionId)
      setAttempt(updated)
    } catch {
      setError('Failed to save your answer. Please try again.')
    }
  }, [attempt, currentQuestion])

  const handleToggleMark = useCallback(async () => {
    if (!attempt || !currentQuestion) return
    try {
      const updated = await api.toggleMark(attempt.id, currentQuestion.id)
      setAttempt(updated)
    } catch {
      setError('Failed to update review flag.')
    }
  }, [attempt, currentQuestion])

  const handleNavigate = useCallback((index: number) => {
    if (index < 0 || (questions && index >= questions.length)) return
    setCurrentIndex(index)
    if (attempt) api.setCurrentIndex(attempt.id, index).catch(() => {})
  }, [questions, attempt])

  const handleSubmit = useCallback(async () => {
    if (!attempt) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await api.submitAssessment(attempt.id)
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      navigate(`/assessment/result/${attempt.id}`, { state: { result } })
    } catch {
      setError('Failed to submit the assessment. Please try again.')
    } finally {
      setSubmitting(false)
      setShowSubmitConfirm(false)
    }
  }, [attempt, navigate, qc])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') handleNavigate(currentIndex + 1)
      else if (e.key === 'ArrowLeft') handleNavigate(currentIndex - 1)
      else if (e.key >= '1' && e.key <= '4' && currentQuestion) {
        const idx = parseInt(e.key, 10) - 1
        if (currentQuestion.options[idx]) handleSelectOption(currentQuestion.options[idx].id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, currentQuestion, handleNavigate, handleSelectOption])

  if (courseQuery.isLoading || questionsQuery.isLoading) return <AssessmentSkeleton />
  if (courseQuery.isError || questionsQuery.isError || !course || !questions) {
    return <div className="flex flex-col items-center justify-center py-20 text-center"><AlertCircle size={32} className="text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-500">Unable to load the assessment. Please ensure the backend service is running.</p><Button className="mt-4" variant="outline" onClick={() => navigate('/curriculum')}>Back to Curriculum</Button></div>
  }
  if (startError) {
    return <div className="flex flex-col items-center justify-center py-20 text-center"><AlertCircle size={32} className="text-red-300" /><p className="mt-3 text-sm font-medium text-red-600">{startError}</p><Button className="mt-4" variant="outline" onClick={() => navigate('/curriculum')}>Back to Curriculum</Button></div>
  }
  if (starting || !attempt || !currentQuestion) return <AssessmentSkeleton />

  const isLastQuestion = currentIndex === questions.length - 1
  const isFirstQuestion = currentIndex === 0

  return <div className="space-y-4">
    {/* Assessment header */}
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExitConfirm(true)} className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700" title="Exit assessment"><X size={16} /></button>
          <div>
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold tracking-wider text-slate-400">{course.code}</span><Badge className="bg-blue-50 text-blue-700">{course.domain}</Badge></div>
            <h1 className="mt-0.5 text-lg font-bold text-slate-950">{course.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn('flex items-center gap-2 rounded-md px-3 py-2', timeRemaining < 60 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700')}>
            <Clock3 size={16} className={timeRemaining < 60 ? 'animate-pulse text-red-500' : 'text-slate-500'} />
            <span className="font-mono text-lg font-bold tabular-nums">{timeFormatted}</span>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[11px] font-medium text-slate-400">Question {currentIndex + 1} of {totalQs}</p>
            <p className="text-[11px] text-slate-400">{answeredCount} answered · {markedCount} marked</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <ProgressBar value={progressValue} className="h-2 flex-1" />
          <span className="text-[11px] font-bold text-slate-600">{percent(progressValue)}</span>
        </div>
      </div>
    </Card>

    <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
      {/* Main question area */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-100 text-slate-600">{currentQuestion.tier}</Badge>
                <Badge className="bg-slate-50 text-slate-500">{currentQuestion.domain}</Badge>
              </div>
              <h2 className="mt-4 text-xl font-bold leading-relaxed text-slate-950">{currentQuestion.question}</h2>
              <p className="mt-2 text-xs text-slate-400">Select the best answer. You can change your selection at any time before submitting.</p>

              <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = selectedOption === option.id
                  return <button key={option.id} role="radio" aria-checked={isSelected} onClick={() => handleSelectOption(option.id)} className={cn('flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all', isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50')}>
                    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all', isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white text-slate-500')}>{String.fromCharCode(65 + i)}</span>
                    <span className={cn('text-sm font-medium', isSelected ? 'text-blue-900' : 'text-slate-700')}>{option.text}</span>
                  </button>
                })}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleNavigate(currentIndex - 1)} disabled={isFirstQuestion}><ArrowLeft size={15} />Previous</Button>
            <Button variant="outline" onClick={() => handleNavigate(currentIndex + 1)} disabled={isLastQuestion}>Next<ArrowRight size={15} /></Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleToggleMark}><Flag size={14} className={attempt.marked.includes(currentQuestion.id) ? 'fill-amber-400 text-amber-500' : 'text-slate-500'} />{attempt.marked.includes(currentQuestion.id) ? 'Unmark' : 'Mark for Review'}</Button>
            <Button onClick={() => setShowSubmitConfirm(true)} disabled={submitting}>{submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}Submit</Button>
          </div>
        </div>

        {error && <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"><AlertCircle size={15} />{error}<button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={14} /></button></div>}
      </div>

      {/* Question navigator sidebar */}
      <div>
        <Card className="sticky top-[88px] overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">Question Navigator</h3>
            <p className="mt-0.5 text-[11px] text-slate-400">Jump to any question</p>
          </div>
          <div className="grid grid-cols-5 gap-2 p-4 xl:grid-cols-5">
            {questions.map((q, i) => {
              const state = questionStates[i]
              return <button key={q.id} onClick={() => handleNavigate(i)} className={cn('flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold transition-all', state === 'current' ? 'border-2 border-blue-500 bg-blue-500 text-white shadow-sm' : state === 'answered' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : state === 'marked' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')} title={`Question ${i + 1}`}>{i + 1}</button>
            })}
          </div>
          <div className="space-y-2 border-t border-slate-100 px-4 py-3">
            <LegendItem color="bg-emerald-500" label={`Answered (${answeredCount})`} />
            <LegendItem color="bg-amber-500" label={`Marked (${markedCount})`} />
            <LegendItem color="bg-slate-300" label={`Unanswered (${totalQs - answeredCount})`} />
          </div>
        </Card>
      </div>
    </div>

    {/* Submit confirmation modal */}
    <AnimatePresence>
      {showSubmitConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setShowSubmitConfirm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Card className="p-6">
              <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"><CheckCircle2 size={20} /></div><div><h3 className="text-base font-bold text-slate-950">Submit assessment?</h3><p className="mt-1 text-sm text-slate-500">You have answered <span className="font-bold text-slate-700">{answeredCount}</span> of <span className="font-bold text-slate-700">{totalQs}</span> questions. {totalQs - answeredCount > 0 && <span className="text-amber-600">{totalQs - answeredCount} will be marked as skipped.</span>} This action cannot be undone.</p></div></div>
              <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={submitting}>{submitting ? <Loader2 size={14} className="animate-spin" /> : null}Submit Now</Button></div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Exit confirmation modal */}
    <AnimatePresence>
      {showExitConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setShowExitConfirm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Card className="p-6">
              <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600"><AlertCircle size={20} /></div><div><h3 className="text-base font-bold text-slate-950">Exit assessment?</h3><p className="mt-1 text-sm text-slate-500">Your progress is saved, but the timer will continue running. You can return to this assessment from the curriculum page.</p></div></div>
              <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowExitConfirm(false)}>Stay</Button><Button variant="secondary" onClick={() => navigate('/curriculum')}>Exit</Button></div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2"><span className={cn('h-2.5 w-2.5 rounded-full', color)} /><span className="text-[11px] font-medium text-slate-600">{label}</span></div>
}

function AssessmentSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-20" /><div className="grid gap-4 xl:grid-cols-[1fr_280px]"><Skeleton className="h-96" /><Skeleton className="h-64" /></div></div>
}
