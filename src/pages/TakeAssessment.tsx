import { useState } from 'react'
import { Card, Button, Badge } from '../components/ui'
import { CheckCircle2, RotateCcw, AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AssessmentQuestion {
  id: string
  number: number
  question: string
  options: { id: string; label: string; text: string }[]
}

const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    number: 1,
    question: 'What is the JVM primarily responsible for?',
    options: [
      { id: 'A', label: 'A', text: 'Hosting the operating system kernel' },
      { id: 'B', label: 'B', text: 'Executing compiled Java bytecode and managing memory/runtime resources' },
      { id: 'C', label: 'C', text: 'Compiling Java source files to binary assembly' },
      { id: 'D', label: 'D', text: 'Managing the AWS backend services' },
    ],
  },
  {
    id: 'q2',
    number: 2,
    question: 'What does the Java Stream API let you do?',
    options: [
      { id: 'A', label: 'A', text: 'Compile Java to Python bytecode' },
      { id: 'B', label: 'B', text: 'Replace all loops with GOTO statements' },
      { id: 'C', label: 'C', text: 'Directly modify the JVM heap size at runtime' },
      { id: 'D', label: 'D', text: 'Process sequences of elements with functional-style operations like map and filter' },
    ],
  },
  {
    id: 'q3',
    number: 3,
    question: 'Why should a developer set boundaries on AI coding-assistant prompts?',
    options: [
      { id: 'A', label: 'A', text: 'To disable autocomplete entirely' },
      { id: 'B', label: 'B', text: 'To make the assistant respond faster' },
      { id: 'C', label: 'C', text: 'To prevent leaking proprietary code or sensitive data into external prompts' },
      { id: 'D', label: 'D', text: "To reduce the assistant's vocabulary" },
    ],
  },
  {
    id: 'q4',
    number: 4,
    question: 'What is a "memory leak" in a Java application?',
    options: [
      { id: 'A', label: 'A', text: 'Objects that are no longer needed but remain reachable, preventing garbage collection' },
      { id: 'B', label: 'B', text: 'A network connection that drops unexpectedly' },
      { id: 'C', label: 'C', text: 'A compiler warning about unused variables' },
      { id: 'D', label: 'D', text: 'A missing semicolon in code' },
    ],
  },
  {
    id: 'q5',
    number: 5,
    question: 'What does "IP" refer to in secure AI prompting rules at a bank?',
    options: [
      { id: 'A', label: 'A', text: 'Issue Priority' },
      { id: 'B', label: 'B', text: 'Internet Protocol addresses only' },
      { id: 'C', label: 'C', text: 'Interest Payments' },
      { id: 'D', label: 'D', text: 'Intellectual Property — proprietary code, data, or business logic' },
    ],
  },
]

export function TakeAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const answeredCount = Object.keys(answers).length
  const totalCount = DEFAULT_QUESTIONS.length

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = () => {
    // Scoring logic (correct answers: Q1:B, Q2:D, Q3:C, Q4:A, Q5:D)
    const correctMap: Record<string, string> = { q1: 'B', q2: 'D', q3: 'C', q4: 'A', q5: 'D' }
    let correct = 0
    DEFAULT_QUESTIONS.forEach((q) => {
      if (answers[q.id] === correctMap[q.id]) correct++
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">LIVE TEST SCREEN</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Take a WF Course Assessment</h1>
        <p className="mt-1 text-xs text-slate-500">
          Options are rebuilt and randomized on each run. Select the single best answer for each question, then submit to finalize your attempt.
        </p>
      </div>

      {/* Course Title Card */}
      <div className="rounded-lg border border-slate-200 bg-[#fbfbf9] px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">COURSE ASSESSMENT</span>
          <h2 className="text-base font-bold text-slate-900">WF-101 Java 21 & Secure AI Prompting</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200">5 Questions</Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">L100 Core</Badge>
        </div>
      </div>

      {/* Result banner if submitted */}
      {submitted && (
        <Card className="p-6 border-emerald-200 bg-emerald-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-emerald-900">Assessment Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700">Your score: <strong>{score}%</strong> ({score && score >= 80 ? 'Passed with Distinction' : 'Passed'}) · +23 credits logged to your ledger</p>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" className="text-xs bg-white">
              <RotateCcw size={13} /> Retake Assessment
            </Button>
          </div>
        </Card>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {DEFAULT_QUESTIONS.map((q) => (
          <Card key={q.id} className="p-6">
            <h3 className="text-sm font-bold text-slate-900">
              Q{q.number}. {q.question}
            </h3>

            <div className="mt-4 space-y-2.5">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id
                return (
                  <label
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-950'
                        : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}>
                      {opt.label}
                    </div>
                    <span className="flex-1">{opt.text}</span>
                  </label>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Bar matching Screenshot */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="text-xs font-semibold text-slate-600">
          <span className="font-bold text-slate-900">{answeredCount}</span> / {totalCount} answered
        </div>

        <div className="flex gap-2">
          {submitted ? (
            <Button onClick={handleReset} variant="outline" className="text-xs">
              <RotateCcw size={13} /> Reset
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="px-6 text-xs font-bold bg-[#3b4b61] hover:bg-[#2c3a4d] text-white"
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>

      {/* Metadata footer matching screenshot */}
      <div className="pt-6 text-[11px] text-slate-400 space-y-1">
        <p><strong>Program Deployment.</strong> Targeted for launch with the incoming global technology campus intake.</p>
        <p>Contact: Engineering Excellence Committee · technology.accelerator@wellsfargo.com</p>
        <p>ASCEND Mockup UI — data illustrative, sourced from the Graduate Developer Accelerator executive board proposal and the Advanced Systems Engineering / Agentic AI course outlines. Wire to LMS / Prometric / HRIS for production use.</p>
      </div>
    </div>
  )
}
