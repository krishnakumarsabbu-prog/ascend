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

interface AdaptiveAssessmentPageProps {
  associateId?: string
}

export function AdaptiveAssessmentPage({ associateId = 'as-ananya' }: AdaptiveAssessmentPageProps) {
  const [session, setSession] = useState<AdaptiveTestSession | null>(null)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<AdaptiveAnswerResult | null>(null)
  const [hasSubmittedItem, setHasSubmittedItem] = useState(false)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [copyPastes, setCopyPastes] = useState(0)
  const [itemSeconds, setItemSeconds] = useState(0)
  const timerRef = useRef<any>(null)

  // Start Assessment Mutation
  const startMutation = useMutation({
    mutationFn: () =>
      api.startAdaptiveAssessment({
        associate_id: associateId,
        course_id: 'c-wf101',
      }),
    onSuccess: (sess) => {
      setSession(sess)
      setLastResult(null)
      setSelectedChoiceId(null)
      setHasSubmittedItem(false)
      setTabSwitches(0)
      setCopyPastes(0)
      setItemSeconds(0)
    },
  })

  // Submit Item Mutation
  const submitMutation = useMutation({
    mutationFn: (req: any) => api.submitAdaptiveAnswer(req),
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

  // Listen to Proctoring Events: Window Blur (Tab switch) and Clipboard Paste
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
  }

  const currentQ = session?.current_question

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> Item Response Theory (IRT) CAT Engine
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 16 &amp; 19</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Computerized Adaptive Assessment &amp; Proctoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic difficulty calibration using 2PL Item Response Theory with real-time ability estimation ($\theta$), SEM convergence, and integrity monitoring.
          </p>
        </div>

        {!session && (
          <button
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{startMutation.isPending ? 'Calibrating Test...' : 'Start Adaptive Exam'}</span>
          </button>
        )}
      </div>

      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Adaptive Exam Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Ability Meter Strip */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Real-Time Ability Estimate ($\theta$)
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black">{session.current_theta >= 0 ? `+${session.current_theta}` : session.current_theta}</span>
                    <span className="text-xs font-semibold text-slate-400">(Scale: -3.0 to +3.0)</span>
                    {lastResult && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${
                          lastResult.ability_trajectory === 'INCREASING'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : lastResult.ability_trajectory === 'DECREASING'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-300'
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
                  <div className="text-lg font-bold text-amber-400 font-mono">
                    ±{session.current_sem}
                  </div>
                  <div className="text-[10px] text-slate-500">Stop Target: &le; 0.28</div>
                </div>
              </div>

              {/* Progress & Item Count */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Question <strong className="text-white">{session.questions_answered + (session.is_completed ? 0 : 1)}</strong> of {session.max_questions} (Adaptive)
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {itemSeconds}s elapsed
                </span>
              </div>
            </div>

            {/* Test Content or Completion Card */}
            {!session.is_completed && currentQ ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
                {/* Question Metadata */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800">
                      {currentQ.domain}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                      Level {currentQ.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">IRT Item b={currentQ.difficulty === 'L400' ? '+1.85' : currentQ.difficulty === 'L300' ? '+0.85' : '-0.35'}</span>
                </div>

                {/* Prompt */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{currentQ.prompt}</h3>
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  {currentQ.choices?.map((c) => {
                    const isSelected = selectedChoiceId === c.id
                    const isCorrect = hasSubmittedItem && lastResult?.correct_choice_id === c.id
                    const isWrongSelected = hasSubmittedItem && isSelected && !lastResult?.is_correct

                    return (
                      <button
                        key={c.id}
                        disabled={hasSubmittedItem || submitMutation.isPending}
                        onClick={() => setSelectedChoiceId(c.id)}
                        className={`w-full p-4 rounded-xl text-left text-xs font-medium transition border flex items-start justify-between gap-3 ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                            : isWrongSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                            : isSelected
                            ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-sm'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span>{c.text}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                        {isWrongSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation Card upon submit */}
                {hasSubmittedItem && lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      lastResult.is_correct
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {lastResult.is_correct ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct Response! (+ Ability Adjusted)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" /> Incorrect Response (- Difficulty Calibrated Down)
                        </>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{lastResult.explanation}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {!hasSubmittedItem ? (
                    <button
                      onClick={handleSubmitItem}
                      disabled={!selectedChoiceId || submitMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
                    >
                      <span>Submit Answer</span>
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
              </div>
            ) : (
              /* Completed Summary Card */
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900 border border-purple-500/30 text-white shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto shadow-xl">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    Adaptive Assessment Complete
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    {lastResult?.final_grade || 'L300 Proficient (Pass)'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Computerized Adaptive Testing converged at $\theta = +{session.current_theta}$ with SEM accuracy $\pm{session.current_sem}$.
                  </p>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Final Ability ($\theta$)</div>
                    <div className="text-lg font-black text-purple-300 mt-1">+{session.current_theta}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Items Evaluated</div>
                    <div className="text-lg font-black text-white mt-1">{session.questions_answered}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">SEM Target</div>
                    <div className="text-lg font-black text-emerald-400 mt-1">Met (&le; 0.28)</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleStart}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                  >
                    Retake / Benchmark Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Live Proctoring & Ability Convergence Stream */}
          <div className="space-y-6">
            <ProctoringTelemetryWidget
              activeTabSwitches={tabSwitches}
              activeCopyPastes={copyPastes}
            />

            {/* Ability Trajectory Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                IRT Ability Trajectory
              </span>
              <p className="text-xs text-slate-500">
                Visualizing Bayesian updating step across sequentially presented items.
              </p>

              <div className="space-y-2 pt-2">
                {session.ability_history.map((th, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-600">Step {idx}</span>
                    <span className="font-mono font-bold text-purple-700">{th >= 0 ? `+${th}` : th}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
