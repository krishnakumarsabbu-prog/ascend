import { useState } from 'react'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import {
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Award,
  Zap,
  Play,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { CurriculumCourse } from '../types'

interface AssessmentQuestion {
  id: string
  number: number
  question: string
  options: { id: string; label: string; text: string }[]
  correctOption: string
  explanation: string
}

const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    number: 1,
    question: 'What is the Java Virtual Machine (JVM) primarily responsible for in enterprise banking systems?',
    options: [
      { id: 'A', label: 'A', text: 'Hosting the operating system kernel and bare-metal disk drivers' },
      { id: 'B', label: 'B', text: 'Executing compiled bytecode, managing garbage collection, and enforcing memory isolation' },
      { id: 'C', label: 'C', text: 'Compiling Java source files directly to binary x86 assembly at authoring time' },
      { id: 'D', label: 'D', text: 'Managing external cloud provider network load balancers' },
    ],
    correctOption: 'B',
    explanation: 'The JVM provides platform independence by executing compiled bytecode and managing runtime resources like the heap, stack, and garbage collection.',
  },
  {
    id: 'q2',
    number: 2,
    question: 'What architectural benefit does the Java 21 Virtual Threads (Project Loom) provide?',
    options: [
      { id: 'A', label: 'A', text: 'Replaces all loops with tail-call recursive structures' },
      { id: 'B', label: 'B', text: 'Enables high-throughput concurrent I/O by decoupling thread concurrency from OS kernel threads' },
      { id: 'C', label: 'C', text: 'Directly modifies physical RAM latency timings' },
      { id: 'D', label: 'D', text: 'Prevents SQL injection vulnerabilities in JDBC connections automatically' },
    ],
    correctOption: 'B',
    explanation: 'Virtual threads are lightweight threads managed by the JVM rather than the OS, allowing millions of concurrent tasks with minimal memory footprint.',
  },
  {
    id: 'q3',
    number: 3,
    question: 'Why must enterprise developers set strict boundaries and redaction on AI coding-assistant prompts?',
    options: [
      { id: 'A', label: 'A', text: 'To reduce the model token processing cost by 99%' },
      { id: 'B', label: 'B', text: 'To prevent leaking proprietary business logic, API secrets, or customer PII into third-party telemetry' },
      { id: 'C', label: 'C', text: 'To force the LLM to write only procedural code rather than object-oriented code' },
      { id: 'D', label: 'D', text: 'To avoid syntax errors in compiled languages' },
    ],
    correctOption: 'B',
    explanation: 'Enterprise governance requires data-loss prevention (DLP) and zero-trust perimeter checks to protect proprietary IP and sensitive financial data.',
  },
  {
    id: 'q4',
    number: 4,
    question: 'In distributed systems, what is the primary purpose of an Idempotency Key in payment transaction APIs?',
    options: [
      { id: 'A', label: 'A', text: 'Ensuring that retried requests do not result in duplicate billing or double-ledger commits' },
      { id: 'B', label: 'B', text: 'Encrypting the HTTP payload with quantum-resistant keys' },
      { id: 'C', label: 'C', text: 'Increasing network socket bandwidth between microservices' },
      { id: 'D', label: 'D', text: 'Auto-generating Swagger OpenAPI documentation' },
    ],
    correctOption: 'A',
    explanation: 'Idempotency guarantees that executing the same operation multiple times produces the exact same outcome as executing it once.',
  },
  {
    id: 'q5',
    number: 5,
    question: 'Which metric measures the latency boundary where 99% of requests complete faster than the target threshold?',
    options: [
      { id: 'A', label: 'A', text: 'Mean Time to Repair (MTTR)' },
      { id: 'B', label: 'B', text: 'P99 Tail Latency' },
      { id: 'C', label: 'C', text: 'CPU Utilization Peak' },
      { id: 'D', label: 'D', text: 'Cyclomatic Complexity' },
    ],
    correctOption: 'B',
    explanation: 'P99 tail latency measures the worst 1% of transactions, ensuring performance SLAs are met even under high-load surges.',
  },
]

export function TakeAssessment() {
  const navigate = useNavigate()
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: api.curriculumCourses,
  })

  const [activeCourseId, setActiveCourseId] = useState<string>('c-java101')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [showLiveExam, setShowLiveExam] = useState(false)

  const answeredCount = Object.keys(answers).length
  const totalCount = DEFAULT_QUESTIONS.length

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = () => {
    let correct = 0
    DEFAULT_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctOption) correct++
    })
    setScore(Math.round((correct / totalCount) * 100))
    setSubmitted(true)
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(null)
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" /> Assessment &amp; Certification Portal
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Early Talent Evaluation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Course Assessments &amp; Exam Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Appear for curriculum gate exams, earn accredited credits, and validate production readiness across core technical domains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/adaptive-assessment"
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition flex items-center gap-2 shadow-2xs"
          >
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Try Adaptive CAT Exam</span>
          </Link>
        </div>
      </div>

      {/* Available Curriculum Course Assessments Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Available Curriculum Course Assessments ({courses.length})
          </h2>
          <span className="text-xs text-slate-400">Select any course to launch full timed exam</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: CurriculumCourse) => {
            const isCompleted = course.status === 'Completed'
            return (
              <Card
                key={course.id}
                className="p-5 flex flex-col justify-between hover:border-blue-300 transition-all hover:shadow-md space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{course.code}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{course.name}</h3>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600">
                      {course.domain}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600">
                      {course.difficulty}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                      +{course.credits} Credits
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/assessment/${course.id}`)}
                    className="w-full py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isCompleted ? 'Retake Exam' : 'Launch Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Interactive Quick Practice Exam Section */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-50 text-sky-700 border border-sky-200">
                Interactive Practice Mode
              </span>
              <span className="text-xs text-slate-400">WF-101 Core Engineering Bench</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Live Interactive Assessment: Java 21 &amp; Enterprise Architecture
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              <strong className="text-slate-900">{answeredCount}</strong> of {totalCount} Answered
            </span>
            <ProgressBar value={answeredCount / totalCount} className="w-28 h-2" />
          </div>
        </div>

        {/* Result banner if submitted */}
        {submitted && (
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">
                    Assessment Submitted &amp; Verified!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Score: <strong>{score}%</strong> ({score && score >= 80 ? 'Mastery Level' : 'Competent'}) · +23 credits credited to ledger.
                  </p>
                </div>
              </div>
              <Button onClick={handleReset} variant="outline" className="text-xs bg-white">
                <RotateCcw size={13} /> Retake Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {DEFAULT_QUESTIONS.map((q) => {
            const isAnswered = Boolean(answers[q.id])
            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xs font-bold text-slate-900 leading-relaxed">
                    <span className="text-[#007df0] font-black mr-1.5">Q{q.number}.</span>
                    {q.question}
                  </h3>
                  {submitted && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        answers[q.id] === q.correctOption
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {answers[q.id] === q.correctOption ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.id
                    const isCorrectAnswer = submitted && opt.id === q.correctOption
                    const isWrongSelection = submitted && isSelected && !isCorrectAnswer

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-xs transition-all cursor-pointer ${
                          isCorrectAnswer
                            ? 'border-emerald-500 bg-emerald-50/80 font-bold text-emerald-950'
                            : isWrongSelection
                            ? 'border-rose-400 bg-rose-50 font-medium text-rose-900'
                            : isSelected
                            ? 'border-[#007df0] bg-sky-50/80 font-semibold text-slate-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isCorrectAnswer
                              ? 'bg-emerald-600 text-white'
                              : isWrongSelection
                              ? 'bg-rose-500 text-white'
                              : isSelected
                              ? 'bg-[#007df0] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </label>
                    )
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-[#007df0] text-[11px] block">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submit action bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500">
            {answeredCount === totalCount ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> All questions completed!
              </span>
            ) : (
              <span>Please answer all questions before final submission</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {submitted ? (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Reset Exam
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-6 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] disabled:opacity-50 text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit &amp; Score Attempt</span>
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
