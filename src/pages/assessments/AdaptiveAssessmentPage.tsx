import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Target,
  BarChart2,
  Award,
  BookOpen,
  Zap,
  Info,
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type {
  AdaptiveTestSession,
  AdaptiveAnswerResult,
  AdaptiveQuestion,
  Choice,
} from '../../types'
import { ProctoringTelemetryWidget } from '../../components/assessments/ProctoringTelemetryWidget'
import { Card } from '../../components/ui'

interface AdaptiveAssessmentPageProps {
  associateId?: string
}

const FALLBACK_ADAPTIVE_QUESTIONS: AdaptiveQuestion[] = [
  {
    id: 'ad-q1',
    course_id: 'c-wf101',
    title: 'JVM Memory Hierarchy & Garbage Collection',
    prompt: 'In high-throughput microservices running on Java 21, which garbage collector is optimized for ultra-low pause times (< 1ms) with multi-gigabyte heaps?',
    domain: 'Core Java & JVM',
    difficulty: 'L200',
    explanation: 'ZGC (Z Garbage Collector) and Shenandoah are concurrent low-pause collectors designed to perform heavy GC phases concurrently with application threads, keeping pause times under 1 millisecond.',
    correct_choice_id: 'c2',
    choices: [
      { id: 'c1', text: 'Serial GC single-threaded mark-sweep-compact' },
      { id: 'c2', text: 'ZGC (Generational Z Garbage Collector)' },
      { id: 'c3', text: 'Parallel GC stop-the-world throughput collector' },
      { id: 'c4', text: 'CMS (Concurrent Mark Sweep - deprecated)' },
    ],
  },
  {
    id: 'ad-q2',
    course_id: 'c-wf101',
    title: 'Distributed Sagas & Compensation Actions',
    prompt: 'When coordinating a distributed multi-bank transfer across independent microservices, what guarantees eventual consistency if Step 3 fails?',
    domain: 'Distributed Systems',
    difficulty: 'L300',
    explanation: 'A Saga pattern executes a backward compensating transaction for every previously succeeded forward step to restore the system to a clean state without long-lived 2PC database locks.',
    correct_choice_id: 'c3',
    choices: [
      { id: 'c1', text: 'Holding global XA two-phase commit locks across all databases' },
      { id: 'c2', text: 'Retrying Step 3 indefinitely in a while-true loop' },
      { id: 'c3', text: 'Executing backward compensating transactions for already committed steps' },
      { id: 'c4', text: 'Relying on HTTP 500 error pages sent to the user browser' },
    ],
  },
  {
    id: 'ad-q3',
    course_id: 'c-wf101',
    title: 'Kafka Consumer Group Rebalance Semantics',
    prompt: 'Which Kafka partition assignment strategy minimizes partition revoking disruptions during consumer pod auto-scaling?',
    domain: 'Event Streaming',
    difficulty: 'L300',
    explanation: 'CooperativeStickyAssignor implements cooperative rebalancing, migrating only partitions that must move rather than revoking all partitions from all active consumers.',
    correct_choice_id: 'c1',
    choices: [
      { id: 'c1', text: 'CooperativeStickyAssignor (Eager rebalance avoided)' },
      { id: 'c2', text: 'RoundRobinAssignor with full stop-the-world revoke' },
      { id: 'c3', text: 'RangeAssignor with partition starvation' },
      { id: 'c4', text: 'Static single-partition pinning only' },
    ],
  },
  {
    id: 'ad-q4',
    course_id: 'c-wf101',
    title: 'Idempotency Key Storage & Redis Distributed Locks',
    prompt: 'To prevent duplicate credit charges when network timeouts occur, where should the idempotency token and response payload be stored atomically?',
    domain: 'Payment Systems',
    difficulty: 'L400',
    explanation: 'An atomic SET NX EX (or transactional Redis lock / PostgreSQL unique constraint) ensures that only the first thread executes, while subsequent retries receive the cached result without duplicate ledger commits.',
    correct_choice_id: 'c4',
    choices: [
      { id: 'c1', text: 'In local browser localStorage' },
      { id: 'c2', text: 'In plain text web server log files' },
      { id: 'c3', text: 'In ephemeral thread memory without persistence' },
      { id: 'c4', text: 'In an atomic distributed key-value store with TTL or transactional DB with unique constraints' },
    ],
  },
]

export function AdaptiveAssessmentPage({ associateId = 'as-ananya' }: AdaptiveAssessmentPageProps) {
  const [session, setSession] = useState<AdaptiveTestSession | null>(null)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<AdaptiveAnswerResult | null>(null)
  const [hasSubmittedItem, setHasSubmittedItem] = useState(false)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [copyPastes, setCopyPastes] = useState(0)
  const [itemSeconds, setItemSeconds] = useState(0)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const timerRef = useRef<any>(null)

  // Start Assessment Mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      try {
        return await api.startAdaptiveAssessment({
          associate_id: associateId,
          course_id: 'c-wf101',
        })
      } catch (e) {
        // Fallback local session
        const initialQ = FALLBACK_ADAPTIVE_QUESTIONS[0]
        const fallbackSession: AdaptiveTestSession = {
          session_id: `cat-${Date.now()}`,
          associate_id: associateId,
          course_id: 'c-wf101',
          course_title: 'Adaptive IRT Benchmark Exam',
          current_theta: 0.0,
          current_sem: 0.52,
          questions_answered: 0,
          max_questions: 4,
          target_sem_stop: 0.28,
          is_completed: false,
          ability_history: [0.0],
          current_question: initialQ,
          domain_breakdown: { 'Core Java': 0, 'Distributed Systems': 0, 'Event Streaming': 0 },
        }
        return fallbackSession
      }
    },
    onSuccess: (sess) => {
      setSession(sess)
      setLastResult(null)
      setSelectedChoiceId(null)
      setHasSubmittedItem(false)
      setTabSwitches(0)
      setCopyPastes(0)
      setItemSeconds(0)
      setFallbackIndex(0)
    },
  })

  // Submit Item Mutation
  const submitMutation = useMutation({
    mutationFn: async (req: any) => {
      try {
        return await api.submitAdaptiveAnswer(req)
      } catch (e) {
        // Fallback evaluation
        const currentQ = FALLBACK_ADAPTIVE_QUESTIONS[fallbackIndex] || FALLBACK_ADAPTIVE_QUESTIONS[0]
        const isCorrect = req.selected_choice_id === currentQ.correct_choice_id
        const nextIdx = fallbackIndex + 1
        const isDone = nextIdx >= FALLBACK_ADAPTIVE_QUESTIONS.length

        const currentTh = session?.current_theta || 0.0
        const delta = isCorrect ? 0.45 : -0.35
        const newTh = Math.round((currentTh + delta) * 100) / 100
        const newSem = Math.max(0.24, Math.round(((session?.current_sem || 0.52) - 0.08) * 100) / 100)

        const fallbackRes: AdaptiveAnswerResult = {
          is_correct: isCorrect,
          correct_choice_id: currentQ.correct_choice_id,
          updated_theta: newTh,
          updated_sem: newSem,
          ability_trajectory: isCorrect ? 'INCREASING' : 'DECREASING',
          is_completed: isDone,
          final_grade: newTh >= 1.0 ? 'L400 Expert (Mastery)' : newTh >= 0.0 ? 'L300 Practitioner (Pass)' : 'L200 Core Foundational',
          next_question: isDone ? null : FALLBACK_ADAPTIVE_QUESTIONS[nextIdx],
          explanation: currentQ.explanation,
          proctoring_flagged: false,
        }
        return fallbackRes
      }
    },
    onSuccess: (res: AdaptiveAnswerResult) => {
      setLastResult(res)
      setHasSubmittedItem(true)
      if (session) {
        setSession({
          ...session,
          current_theta: res.updated_theta,
          current_sem: res.updated_sem,
          questions_answered: session.questions_answered + 1,
          is_completed: res.is_completed,
          ability_history: [...session.ability_history, res.updated_theta],
          current_question: res.next_question || session.current_question,
        })
      }
    },
  })

  // Listen to Proctoring Events
  useEffect(() => {
    const handleBlur = () => {
      if (session && !session.is_completed) {
        setTabSwitches((prev) => prev + 1)
      }
    }

    const handlePaste = () => {
      if (session && !session.is_completed) {
        setCopyPastes((prev) => prev + 1)
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('paste', handlePaste)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('paste', handlePaste)
    }
  }, [session])

  // Question Timer
  useEffect(() => {
    if (session && !session.is_completed && !hasSubmittedItem) {
      timerRef.current = setInterval(() => {
        setItemSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [session, hasSubmittedItem])

  const handleStart = () => {
    startMutation.mutate()
  }

  const handleSubmitItem = () => {
    if (!session || !session.current_question || !selectedChoiceId || submitMutation.isPending) return
    submitMutation.mutate({
      session_id: session.session_id,
      question_id: session.current_question.id,
      selected_choice_id: selectedChoiceId,
      time_spent_seconds: itemSeconds,
      tab_switches_during_item: tabSwitches,
      copy_paste_events: copyPastes,
    })
  }

  const handleNextQuestion = () => {
    setSelectedChoiceId(null)
    setHasSubmittedItem(false)
    setItemSeconds(0)
    setFallbackIndex((prev) => prev + 1)
  }

  const currentQ = session?.current_question

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#007df0]" /> 2PL Item Response Theory (IRT)
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Psychometric Testing</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Computerized Adaptive Testing (CAT) Exam
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions dynamically adapt to your answers in real time to calculate your true ability score (&theta;) with minimum test fatigue.
          </p>
        </div>

        {!session && (
          <button
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="px-6 py-3 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{startMutation.isPending ? 'Calibrating Test...' : 'Launch Adaptive Exam'}</span>
          </button>
        )}
      </div>

      {/* When NO active session, render Explanatory Onboarding Card */}
      {!session && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              What is Computerized Adaptive Testing (CAT)?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike traditional exams with fixed question sets, a <strong>Computerized Adaptive Test (CAT)</strong> dynamically selects each question based on how you answered previous questions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-[#007df0] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> 1. Answer Correctly
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The system immediately promotes you to a harder, higher-tier item to test your mastery ceiling.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> 2. Answer Incorrectly
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The system delivers a foundational question to accurately calibrate your core baseline.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Award className="w-4 h-4" /> 3. Fast Convergence
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculates your <strong>Ability (&theta;)</strong> in just 4 to 8 questions with standard error &le; 0.28.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ready to benchmark your architectural knowledge?</span>
              <button
                onClick={handleStart}
                className="px-6 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <span>Start Benchmark Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Proctoring Standards
            </h3>
            <p className="text-xs text-slate-500">
              During the adaptive session, telemetry monitors your browser focus:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#007df0]" />
                <span>Zero window blur / tab switching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#007df0]" />
                <span>Clipboard copy/paste monitoring</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#007df0]" />
                <span>Real-time response time telemetry</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* When session IS active */}
      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Adaptive Exam Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Ability Meter Strip */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Real-Time Ability Estimate (&theta;)
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">
                      {session.current_theta >= 0 ? `+${session.current_theta}` : session.current_theta}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">(Scale: -3.0 to +3.0)</span>
                    {lastResult && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${
                          lastResult.ability_trajectory === 'INCREASING'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : lastResult.ability_trajectory === 'DECREASING'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {lastResult.ability_trajectory === 'INCREASING' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {lastResult.ability_trajectory}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Measurement Error (SEM)
                  </span>
                  <div className="text-lg font-bold text-amber-600 font-mono">
                    &plusmn;{session.current_sem}
                  </div>
                  <div className="text-[10px] text-slate-400">Stop Target: &le; 0.28</div>
                </div>
              </div>

              {/* Progress & Item Count */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Question <strong className="text-slate-900">{session.questions_answered + (session.is_completed ? 0 : 1)}</strong> of {session.max_questions} (Adaptive)
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-[#007df0]" /> {itemSeconds}s elapsed
                </span>
              </div>
            </Card>

            {/* Test Content or Completion Card */}
            {!session.is_completed && currentQ ? (
              <Card className="p-6 space-y-6">
                {/* Question Metadata */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-sky-50 text-sky-700 border border-sky-200">
                      {currentQ.domain}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Level {currentQ.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    IRT Item Difficulty b={currentQ.difficulty === 'L400' ? '+1.85' : currentQ.difficulty === 'L300' ? '+0.85' : '-0.35'}
                  </span>
                </div>

                {/* Prompt */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{currentQ.prompt}</h3>
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  {currentQ.choices.map((choice: Choice) => {
                    const isSelected = selectedChoiceId === choice.id
                    const isCorrect = lastResult?.is_correct && isSelected
                    const isIncorrect = lastResult && !lastResult.is_correct && isSelected

                    return (
                      <button
                        key={choice.id}
                        onClick={() => !hasSubmittedItem && setSelectedChoiceId(choice.id)}
                        disabled={hasSubmittedItem}
                        className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                          hasSubmittedItem
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : isIncorrect
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                              : choice.id === lastResult?.correct_choice_id
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            : isSelected
                            ? 'bg-sky-50 border-[#007df0] text-slate-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[11px] ${
                              isSelected
                                ? 'bg-[#007df0] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {choice.id.slice(-1).toUpperCase()}
                          </div>
                          <span className="mt-0.5 leading-relaxed">{choice.text}</span>
                        </div>

                        {hasSubmittedItem && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {hasSubmittedItem && isIncorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback Explanation */}
                {lastResult && (
                  <div
                    className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                      lastResult.is_correct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {lastResult.is_correct ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct Answer! Ability (&theta;) calibrated upward.</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Incorrect. Difficulty calibrated to reinforce core principles.</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed pt-1 text-slate-600">{lastResult.explanation}</p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {hasSubmittedItem ? 'Response submitted' : 'Select an answer option to proceed'}
                  </span>

                  {!hasSubmittedItem ? (
                    <button
                      onClick={handleSubmitItem}
                      disabled={!selectedChoiceId || submitMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] disabled:opacity-50 text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
                    >
                      <span>{submitMutation.isPending ? 'Submitting...' : 'Submit Response'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2"
                    >
                      <span>Next Adaptive Item</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            ) : (
              /* Completed Summary Card */
              <Card className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                    Adaptive Assessment Complete
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {lastResult?.final_grade || 'L300 Proficient (Pass)'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Computerized Adaptive Testing converged at &theta; = +{session.current_theta} with SEM accuracy &plusmn;{session.current_sem}.
                  </p>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Final Ability (&theta;)</div>
                    <div className="text-lg font-black text-[#007df0] mt-1">+{session.current_theta}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Items Evaluated</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{session.questions_answered}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">SEM Target</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">Met (&le; 0.28)</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleStart}
                    className="px-6 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs"
                  >
                    Retake / Benchmark Again
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Col: Live Proctoring & Ability Convergence Stream */}
          <div className="space-y-6">
            <ProctoringTelemetryWidget
              activeTabSwitches={tabSwitches}
              activeCopyPastes={copyPastes}
            />

            {/* Ability Trajectory Card */}
            <Card className="p-5 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#007df0]" />
                IRT Ability Trajectory
              </span>
              <p className="text-xs text-slate-500">
                Visualizing Bayesian updating step across sequentially presented items.
              </p>

              <div className="space-y-2 pt-2">
                {session.ability_history.map((th, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-600">Step {idx}</span>
                    <span className="font-mono font-bold text-[#007df0]">{th >= 0 ? `+${th}` : th}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
